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
 * Transcribe an LLM event to a frontend message.
 * @param llmEvent The LLM event received.
 * @returns A frontend message.
 */
const transcribeLLMEvents = (llmEvent: LLMEvents): FrontendMessages => {
    let type = void 0 as FrontendMessageTypes | undefined;
    let message = '';
    const conversation_id = llmEvent.conversation_id;

    switch (llmEvent.event) {
        case 'message':
            type = 'text';
            message = llmEvent.answer;
            break;
        case 'node_started':
            type = 'process';
            message = llmEvent.data.title;
            break;
    }

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
        yieldMessage: (llmEvent: FrontendMessages) => void,
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
                if (line.startsWith('data: ')) {
                    const jsonStr = line.slice('data: '.length).trim();
                    if (jsonStr === '[DONE]') {
                        console.log('Stream finished');
                        onEnd();
                        return;
                    }
                    try {
                        const llmEventJson = JSON.parse(jsonStr);
                        const frontendMessage = transcribeLLMEvents(llmEventJson);
                        yieldMessage(frontendMessage);
                    } catch (e) {
                        console.error('JSON parse error', e, jsonStr);
                    }
                }
            }
        }
    } catch (error) {
        onError(error);
        console.error(error);
    }
}