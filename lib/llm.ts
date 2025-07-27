import fetch from "node-fetch";

/**
 * Checks if the backend server is usable.
 * @returns Whether the server is alive or not.
 */
const checkAlive = async (): Promise<boolean> => {
    try {
        const res = await fetch(
            'http://localhost:3000/are-you-still-there', 
            { method: 'GET' });
        return res.ok;
    } catch (e) {
        return false;
    }
};

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
async function chat(
    query: string,
    conversation_id: string = '',
    callbacks: {
        yieldMessage: (llmEvent: FrontendMessages) => void,
        onEnd: () => void,
        onError: (error: any) => void
    },
) {
    const { yieldMessage, onEnd, onError } = callbacks;

    // Request and receive stream obj.
    const res_hyz = await fetch("http://localhost:3000/chat", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            conversation_id,
        }),
    });

    if (!res_hyz) {
        onError(new Error('Request failed!'));
        return;
    }

    const stream = res_hyz.body;
    if (!stream) {
        onError(new Error('Request failed!'));
        return;
    }

    // Process stream obj and yield from time to time.
    const decoder = new TextDecoder('utf-8');
    let textBuffer = '';

    stream.on('data', (chunk) => {
        const chunkPlainText = decoder.decode(chunk, { stream: true });

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
            } catch (e) {
                if (!(e instanceof SyntaxError)) {
                    throw e;
                }
            }
        }
    });

    stream.on('end', onEnd);

    stream.on('error', () => {
        console.log({
            type: 'error',
            message: '由于网络波动，未能处理您的请求！'
        })
    });

}

chat(
    '简单讲一下你的项目吧。',
    '407b980c-4dc0-4c30-afa7-a4fd68a69b0e',
    {
        yieldMessage: (msg: FrontendMessages) => {
            console.log(msg);
        },
        onEnd: () => {
            console.log('end');
        },
        onError: (error: Error) => {
            console.log(error);
        }
    });