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
                            
                            <div className={`
                                flex flex-row w-full
                                items-center justify-between`}>
                                    {/** Left part: Institution Name + Major + Degree*/}
                                    <div className={`flex flex-col w-1/2`}>
                                        <p className="font-bold text-[1rem]">
                                            {edu.institution}
                                        </p>
                                        <p className="text-sm">
                                            {`${edu.major}, ${edu.degree}`}
                                        </p>
                                    </div>

                                    {/** Right part: Time, GPA */}
                                    <div className={`flex flex-col text-right text-sm`}>
                                        <p>{`${edu.start_date} - ${edu.end_date}`}</p>
                                        <p>{`GPA: ${edu.gpa}`}</p>
                                    </div>
                            </div>
                                
                        </div>
                    </Link>
                ))
            }
        </>
    );
};

export default Education;