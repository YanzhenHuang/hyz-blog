"use client"

import Link from "next/link";

const Education = (props: {
    education: Education[]
}) => {
    const { education } = props;
    return (
        <>
            {
                education.map((edu, index) => (
                    <Link key={index} href={edu.url} target="_blank">
                        <div
                            className={`
                                flex flex-col w-full items-start
                                justify-top p-2 rounded-md 
                                hover:bg-customGray-100 
                                dark:hover:bg-customGray-900 
                                hover:cursor-pointer transition-all`}>
                                    
                            {/** First Row: Institution name + Date */}
                            <div className={`
                                flex flex-row w-full
                                items-center justify-between`}>
                                <p className="font-bold text-[1rem] w-3/4">
                                    {edu.institution}
                                </p>
                                <p className={`text-right`}>
                                    {`${edu.start_date} - ${edu.end_date}`}
                                </p>
                            </div>

                            {/** Second Row: Major name + GPA */}
                            <div className={`
                                flex flex-row w-full
                                items-center justify-between`}>
                                <p>{`${edu.major}, ${edu.degree}`}</p>
                                <p>{`GPA: ${edu.gpa}`}</p>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </>
    );
};

export default Education;