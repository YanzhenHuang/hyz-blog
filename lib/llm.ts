import fetch from "node-fetch";
const transcribeLLMEvents = (llmEvent: LLMEvents): FrontendMessages => {
    let type = void 0 as FrontendMessageTypes | undefined;
    let message = '';

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

    return { type, message };
}

async function chat(
    yieldMessage: (llmEvent: FrontendMessages) => void,
    onEnd: () => void = () => {},
    onError: (error: any) => void = () => {},
) {
    const res_hyz = await fetch("http://localhost:3000/chat", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: '请介绍你自己。',
        }),
    });

    if (!res_hyz) {
        console.log("请求失败");
    }

    const stream = res_hyz.body;
    if (!stream) {
        throw new Error('No streaming body.');
    }

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

    stream.on('end', () => {

    });

    stream.on('error', () => {
        console.log({
            type: 'error',
            message: '由于网络波动，未能处理您的请求！'
        })
    });

}

chat((msg: FrontendMessages) => {
    console.log(msg);
});