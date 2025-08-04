// /**
//  * Checks if the backend server is usable.
//  * @returns Whether the server is alive or not.
//  */
// const checkAlive = async (): Promise<boolean> => {
//     try {
//         const res = await fetch(
//             'http://localhost:7016/are-you-still-there',
//             { method: 'GET' });
//         return res.ok;
//     } catch (e) {
//         return false;
//     }
// };

/**
 * A mapping object from LLM events to frontend messages.
 */
const LLMToFrontend = {
    'message': { type: 'text', getMessage: (llmEvent: LLMMessage) => llmEvent.answer },
    'node_started': {
        type: 'process', getMessage: (llmEvent: LLMNodeStarted) => {
            return `Node ${llmEvent.data.title} started!`
        }
    },
    'node_finished': {
        type: 'process',
        getMessage: (llmEvent: LLMNodeFinished) => {
            const { title, status, error } = llmEvent.data;
            return `Node ${title} finished, ${status}. ${error ? `Error: ${error}` : ''}`;
        }
    },
    'workflow_started': {
        type: 'process',
        getMessage: (llmEvent: LLMWorkflowStarted) => `Workflow started: ${llmEvent.data.id}.`
    },
    'workflow_finished': {
        type: 'ended',
        getMessage: (llmEvent: LLMWorkflowFinished) => {
            const { id, status, error } = llmEvent.data;
            return `Node ${id} finished, ${status}. ${error ? `Error: ${error}` : ''}`
        }
    },
    'message_end': {
        type: 'ended',
        getMessage: (llmEvent: LLMMessageEnd) => {
            return `Message ${llmEvent.message_id} ended.`
        }
    }
} as Record<
    LLMEventTypes,
    {
        type: FrontendMessageTypes,
        getMessage: (llmEvent: LLMEvents) => string
    }>;

/**
 * Transcribe an LLM event to a frontend message.
 * @param llmEvent The LLM event received.
 * @returns A frontend message.
 */
const transcribeLLMEvents = (llmEvent: LLMEvents): FrontendMessages => {
    const conversation_id = llmEvent.conversation_id;
    const { type, getMessage } = LLMToFrontend[llmEvent.event];
    const message = getMessage(llmEvent);

    return { type, message, conversation_id };
}

/**
 * Send user's query to backend, receive frowarded streamed LLM messages
 * and send to the frontend UI.
 * @param query User's question for the LLM.
 * @param conversation_id Conversation ID context previously stored.
 * @param callbacks Callback functions when message received, stream ended and error.
 * @returns void.
 */
export async function chat(
    query: string,
    conversation_id: string = '',
    callbacks: {
        yieldMessage: (frontendMessage: FrontendMessages) => void,
        onEnd: () => void,
        onError: (error: unknown) => void
    },
) {
    const { yieldMessage, onEnd, onError } = callbacks;

    try {
        // Request and receive stream obj.
        const res_hyz = await fetch(
            "https://www.huangyanzhen-backend.dev/chat",
            // "http://localhost:7016/chat",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    conversation_id,
                }),
            });

        if (!res_hyz.ok) {
            console.log(res_hyz);
            onError(new Error('Request failed!'));
            return;
        }

        const reader = res_hyz.body?.getReader();
        if (!reader) {
            onError(new Error('No response body!'));
            return;
        }

        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        // let timerId = setTimeout(onEnd, 15 * 1000); // 30s 内无消息就停。

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                console.log('Ended');
                onEnd();
                break;
            }

            // clearTimeout(timerId);

            buffer += decoder.decode(value, { stream: true });

            // 按行切分
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 最后一行可能是不完整的，留在 buffer

            for (const line of lines) {
                if (!line.startsWith('data: '))
                    continue;

                const jsonStr = line.slice('data: '.length).trim();

                if (!jsonStr) {
                    console.log('Stream finished');
                    onEnd();
                    return;
                }

                try {
                    const llmEventJson = JSON.parse(jsonStr);
                    const frontendMessage = transcribeLLMEvents(llmEventJson);
                    switch (frontendMessage.type) {
                        case 'text':
                            yieldMessage(frontendMessage);
                        case 'ended':
                            onEnd();
                        case 'process':
                            (() => {})();
                    }
                } catch (e) {
                    console.error('JSON parse error', e, jsonStr);
                }
                
            }
        }
    } catch (error) {
        onError(error);
        console.error(error);
    }
}