"use client"

// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { columns, DataTable } from "./repo-table";

import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// React
import Link from "next/link";


const GitHubOrgs = (props: {
    gitHubOrganizationData: GitHubOrganizationData[]
}) => {
    const { gitHubOrganizationData } = props;
    return (
        <div className={`
            flex flex-row w-full gap-2 
            max-md:flex-col max-md:max-h-[15rem] 
            max-md:overflow-y-scroll`}>
            {gitHubOrganizationData?.map((org, id) => (
                <div
                    key={id}
                    className={`
                        w-full border rounded-md 
                        hover:bg-customGray-100 dark:hover:bg-customGray-900 
                        transition-all`}>
                    <Link
                        href={`https://github.com/${org.login}`}
                        target="_blank">
                        <CardHeader className="gap-2">
                            <CardTitle>
                                <div className="flex flex-row gap-2 items-center">
                                    <Avatar className="w-8 h-8 rounded-md">
                                        <AvatarImage src={org.avatar_url} />
                                        <AvatarFallback>{org.login}</AvatarFallback>
                                    </Avatar>
                                    <p>{org.login}</p>
                                </div>
                            </CardTitle>
                            <CardDescription>{org.description}</CardDescription>
                        </CardHeader>
                        <CardContent></CardContent>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default GitHubOrgs;