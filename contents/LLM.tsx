"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import exp from "constants";
import { useState } from "react";

export type Chat = {
    content: string,
    role: "user" | "assistant",
}

export default function LLM() {
    const [chatList, setChatList] = useState<Chat[]>([
        {'role': 'user', 'content': 'HiHiHi HiHiHiHiHiHiHiH iHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi'}
    ]);
    return (
        <div className={`flex flex-col gap-2 w-full`}>
            <div className={`flex flex-col w-full overflow-hidden`}>
                {chatList.map(chat => (
                    <p className={`w-full overflow-break-words`}>
                        {chat.content}
                    </p>
                ))}
            </div>
            <div className={`flex flex-row items-center gap-2`}>
                <Textarea placeholder="LLM" className={`resize-none`}/> 
                <Button>发送</Button>
            </div>
        </div>
    );
}