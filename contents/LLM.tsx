"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createRef, useEffect, useState } from "react";
import { chat } from "@/lib/llm";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { scrollToBottom } from "@/lib/ui-tools";

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
    const scrollContainerRef = createRef<HTMLDivElement>();

    const { toast } = useToast();

    useEffect(() => {
        if (!scrollContainerRef.current)
            return;
        scrollToBottom(scrollContainerRef);
    }, [chatList])

    return (
        <div className={`flex flex-col gap-2 w-full`}>
            <div className={`
                flex flex-col w-full h-80
                border border-[#00000055] dark:border-[#ffffff22] rounded-md 
                
                `}>
                <div
                    ref={scrollContainerRef}
                    className={`
                    flex flex-col w-full gap-3
                    overflow-y-auto simplified-scrollbar`}>
                    {chatList.map((chat, i) => (
                        <div>
                            <span className={`
                            flex flex-row text-justify ml-auto
                            ${chat.role == 'user' ? 'w-1/2' : 'w-full'} 
                            ${chat.role == 'user' && 'bg-[#1e1e1e55]'}
                            px-5 py-2 rounded-lg`}>
                                {`${chat.content}${(
                                    i == chatList.length - 1 &&
                                    chat.role == 'assistant' &&
                                    respondStatus == 2) ?
                                    '⬤' : ''}`}
                            </span>
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
                    disabled={respondStatus > 0} />
                <Button onClick={() => {
                    if (!textAreaRef.current?.value) {
                        toast({
                            title: '请至少输入一个文字~',
                            description: '欲要成其事，必先利其器',
                            action: (
                                <ToastAction altText="知道了">知道了</ToastAction>
                            ),
                        });
                        return;
                    }

                    setRespondStatus(1);
                    const query = textAreaRef.current.value;
                    setChatList(list => [...list, { role: 'user', content: query }, { role: 'assistant', content: '' }])

                    textAreaRef.current.value = '';

                    let receivedContent = '';

                    chat(query, '', {
                        yieldMessage: (msg: FrontendMessages) => {
                            console.log(msg);
                            if (msg.type != 'process') {
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
                            setRespondStatus(0);
                            toast({
                                title: '哎呀，有点小错误！',
                                description: '可能是服务器开小差啦，等会再问呗QAQ',
                                action: (
                                    <ToastAction altText="知道了">知道了</ToastAction>
                                ),
                            });
                            console.log('嘿嘿，我就知道你会点进来看~ 呐，下面就是错误，别笑我哦↓');
                            console.error(error);
                        }
                    });
                }}>发送
                </Button>
            </div>
        </div>
    );
}