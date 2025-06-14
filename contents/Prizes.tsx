"use client"

import { Trophy } from "lucide-react";
import Link from "next/link";

const Prizes = (props: {
    prizes: Prize[]
}) => {
    const { prizes } = props;
    return (
        <>
            {
                prizes.map((prize, index) => (
                    <Link key={index} href={prize.link} target="_blank">
                        <div
                            className={`
                                flex flex-col w-full items-start
                                justify-top p-2 rounded-md 
                                hover:bg-customGray-100 
                                dark:hover:bg-customGray-900 
                                hover:cursor-pointer transition-all`}>

                            <div className={`
                                flex flex-row w-full
                                items-center justify-between`}>
                                <div className={`flex flex-col w-11/12`}>
                                    <p className={`text-sm`}>{`${prize.about} | ${prize.title.CN}`}</p>
                                    <p className={`text-xs opacity-70`}>{prize.title.EN}</p>
                                </div>
                                <Trophy />
                            </div>
                        </div>
                    </Link>
                ))
            }
        </>
    );
};

export default Prizes;