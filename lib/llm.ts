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
            // "https://www.huangyanzhen-backend.dev/chat",
            "http://localhost:7016/chat",
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

        // Process stream obj and yield from time to time.
        const decoder = new TextDecoder('utf-8');
        let textBuffer = '';

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                console.log('Ended');
                onEnd();
                break;
            }

            const chunkPlainText = decoder.decode(value, { stream: true });

            if (chunkPlainText.startsWith('data: ')) {
                try {
                    const llmEventJson = JSON.parse(chunkPlainText.slice('data: '.length));
                    const frontendMessage = transcribeLLMEvents(llmEventJson);
                    yieldMessage(frontendMessage);
                } catch (e) {
                    if (!(e instanceof SyntaxError)) {
                        throw e;
                    }
                    textBuffer = chunkPlainText;
                }
            } else {
                textBuffer += chunkPlainText;
                try {
                    const llmEventJson = JSON.parse(textBuffer);
                    const frontendMessage = transcribeLLMEvents(llmEventJson);
                    yieldMessage(frontendMessage);
                    textBuffer = '';
                } catch (e) {
                    if (!(e instanceof SyntaxError)) {
                        throw e;
                    }
                }
            }
        }
    } catch (error) {
        onError(error);
        console.error(error);
    }
}