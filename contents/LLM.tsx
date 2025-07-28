"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import exp from "constants";
import { createRef, useState } from "react";
import { chat } from "@/lib/llm";

export type Chat = {
    content: string,
    role: "user" | "assistant",
}

export default function LLM() {
    const [chatList, setChatList] = useState<Chat[]>([
        {
            'role': 'assistant',
            'content': '我是黄彦祯的代理LLM，请问我你想问的问题！'
        }
    ]);

    const [respondStatus, setRespondStatus] = useState<number>(0);

    const textAreaRef = createRef<HTMLTextAreaElement>();
    const [textAreaContent, setTextAreaContent] = useState<string | undefined>(void 0);


    return (
        <div className={`flex flex-col gap-2 w-full`}>
            <div className={`
                flex flex-col w-full h-80
                `}>
                <div className={`
                    flex flex-col w-full gap-3
                    overflow-y-auto simplified-scrollbar`}>
                    {chatList.map(chat => (
                        <div>
                            <p className={`
                            flex flex-row text-justify ml-auto
                            ${chat.role == 'user' ? 'w-1/2' : 'w-full'} 
                            ${chat.role == 'user' && 'bg-[#1e1e1e55]'}
                            px-5 py-2 rounded-lg`}>
                                {chat.content}
                            </p>
                        </div>
                    ))}
                </div>
                {respondStatus == 1 && (
                    <div className={`flex flex-row px-5 italic opacity-50`}>
                        思考中...
                    </div>
                )}
            </div>
            <div className={`flex flex-row items-center gap-2`}>
                <Textarea
                    ref={textAreaRef}
                    placeholder={respondStatus ? '请等待LLM回答结束^ω^' : `请问问题~`}
                    className={`resize-none`}
                    disabled={respondStatus > 0}
                    onChange={(e) => setTextAreaContent(e.target.value)} />
                <Button onClick={() => {
                    setRespondStatus(1);
                    if (!textAreaContent)
                        return;
                    setChatList(list => [...list, { role: 'user', content: query }, { role: 'assistant', content: '' }])
                    const query = textAreaContent;

                    setTextAreaContent(void 0);

                    if (textAreaRef.current) {
                        textAreaRef.current.value = '';
                    }

                    let receivedContent = '';
                    chat(query, '', {
                        yieldMessage: (msg: FrontendMessages) => {
                            console.log(msg);
                            if (msg.type == 'process') {
                                setRespondStatus(2);
                            }

                            if (msg.type == 'text') {
                                receivedContent += msg.message;
                                setChatList(list => {
                                    const newList = [...list];
                                    const lastItem = newList[newList.length - 1];
                                    if (lastItem && lastItem.role === 'assistant') {
                                        // 在最后一个元素的content中添加新字符
                                        lastItem.content = receivedContent;
                                    }
                                    return newList;
                                });
                            }
                        },
                        onEnd: () => {
                            setRespondStatus(0);
                        },
                        onError: (error) => {
                            console.log(error);
                        }
                    });
                }}>发送
                </Button>
            </div>
        </div>
    );
}