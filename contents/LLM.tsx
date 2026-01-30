"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createRef, useEffect, useState } from "react";
import { chat } from "@/lib/llm";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { scrollToBottom } from "@/lib/ui-tools";
import { useMemo } from "react";

export type Chat = {
    content: string,
    role: "user" | "assistant",
}

export default function LLM(params: {
    dict: any
}) {

    const { dict } = params;

    const [chatList, setChatList] = useState<Chat[]>([
        {
            'role': 'assistant',
            'content': dict.llm.assistant_intro,
        },
    ]);

    const [respondStatus, setRespondStatus] = useState<number>(0);

    const textAreaRef = createRef<HTMLTextAreaElement>();
    const scrollContainerRef = createRef<HTMLDivElement>();

    const { toast } = useToast();

    const ask = () => {
        if (!textAreaRef.current?.value) {
            toast({
                title: dict.llm.question_empty_toast_title,
                description: dict.llm.question_empty_toast_description,
                action: (
                    <ToastAction altText={dict.ui.user_ok}>
                        {dict.ui.user_ok}
                    </ToastAction>
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
                    title: dict.llm.server_error_toast_title,
                    description: dict.llm.server_error_toast_description,
                    action: (
                        <ToastAction altText={dict.ui.user_ok}>{dict.ui.user_ok}</ToastAction>
                    ),
                });
                console.log(dict.llm.console_log_for_employer);
                console.error(error);
            }
        });
    }

    useEffect(() => {
        if (!scrollContainerRef.current)
            return;
        scrollToBottom(scrollContainerRef);
    }, [chatList, scrollContainerRef]);

    /**
     * 聊天列表相关
     */

    const isLastMessage = useMemo(() => {
        return (index: number) => index === chatList.length - 1;
    }, [chatList.length]);

    const shouldShowBullet = useMemo(() => {
        return (role: string, index: number) =>
            isLastMessage(index) &&
            role === 'assistant' &&
            respondStatus === 2;
    }, [isLastMessage, respondStatus]);

    const realtimeChatContent = useMemo(() => {
        return (chat: Chat, index: number) => {
            return `${chat.content}${shouldShowBullet(chat.role, index) ? '⬤' : ''}`;
        };
    }, [shouldShowBullet]);

    const chatElements = useMemo(() => {
        return chatList.map((chat, i) => {
            let style = ''
            switch (chat.role) {
                case 'assistant':
                    style = `
                        flex flex-row text-justify 
                        ml-auto w-full`;
                    break;
                case 'user':
                    style = `
                        flex flex-row text-justify ml-auto
                        bg-[#dedede] dark:bg-[#1e1e1e]
                        rounded-lg w-full max-w-fit
                        px-5 py-2`
            }

            return (
                <div key={i}>
                    <span className={style}>
                        {realtimeChatContent(chat, i)}
                    </span>
                </div>);
        });
    }, [chatList, respondStatus]);



    return (
        <div className={`flex flex-col gap-2 w-full`}>
            {/** 
             * Main Chat Panel
            */}
            <div className={`
                flex flex-col w-full h-80
                border border-customGray-200 dark:border-customGray-800 rounded-md`}>

                {/** Chat List */}
                <div
                    ref={scrollContainerRef}
                    className={`
                    flex flex-col w-full gap-3 px-5 py-2
                    overflow-y-auto simplified-scrollbar`}>
                    {/** Temporary System Message */}
                    <p className="text-xs italic opacity-50">
                        {dict.llm.safe_declare}
                    </p>

                    {/** Chat List */}
                    {chatElements}
                </div>
                {/** 思考中Tag */}
                {respondStatus == 1 && (
                    <div className={`flex flex-row px-5 italic opacity-50`}>
                        {dict.llm.thinking}
                    </div>
                )}
            </div>

            {/** Input & Send */}
            <div className={`flex flex-row items-center gap-2`}>
                <Textarea
                    ref={textAreaRef}
                    placeholder={respondStatus ? dict.llm.please_wait : dict.llm.please_ask}
                    className={`resize-none`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            ask();
                        }
                    }}
                    disabled={respondStatus > 0} />
                <Button onClick={ask} disabled={respondStatus > 0}>
                    {dict.ui.send}
                </Button>
            </div>
        </div>
    );
}