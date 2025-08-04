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
            overflow-x-auto
            max-sm:flex-col max-md:max-h-[15rem] 
            max-md:overflow-y-auto`}>
            {gitHubOrganizationData?.map((org, id) => (
                <div
                    key={id}
                    className={`
                        w-64 max-sm:w-full shrink-0 border rounded-md max-h-48
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
                            <CardDescription className={`line-clamp-3`}>{org.description}</CardDescription>
                        </CardHeader>
                        <CardContent></CardContent>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default GitHubOrgs;