"use client"

// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Icons
import { GitBranchIcon, Mail01Icon, SmartPhone01Icon } from "hugeicons-react";

// React
import Link from "next/link";

const GitHubStatus = (props: {
    githubUserData: GitHubUserData,
    reposData: GitHubRepoData[]
}) => {
    const { githubUserData, reposData } = props;
    return (
        <div className="flex flex-col gap-2">
            {/** Github Account Info */}
            <div className="flex flex-row w-full gap-12 items-center">
                {/** Github Profile */}
                <div className="flex flex-col justify-left">
                    <p className="font-bold text-[1.5rem]">
                        {githubUserData.login || "NULL"}
                    </p>
                    <p className="opacity-50">{`# ${githubUserData.id}`}</p>
                    <p className="text-[0.8rem] text-left">
                        {githubUserData.bio}
                    </p>
                </div>

                {/* Github Avatar */}
                <Avatar>
                    <AvatarImage src={githubUserData.avatar_url} />
                    <AvatarFallback>YZ</AvatarFallback>
                </Avatar>
            </div>

            {/** Repositories */}
            <div className="flex flex-col items-center gap-2 justify-center">
                <CardTitle className="w-full p-1">Personal Repos</CardTitle>
                <Carousel
                    className="flex flex-col rounded-md border w-[16rem] max-md:w-[14rem] max-sm:w-[14rem]"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    {/** Repository list carousel */}
                    <CarouselContent>
                        {reposData.map((repo, id) => (
                            <CarouselItem key={id} className="relative">
                                <Link href={repo.html_url} target="_blank">
                                    <div className="flex flex-col gap-2 p-3 pb-10 h-full">
                                        {/** Repo title */}
                                        <div className="flex flex-row items-center justify-between">
                                            <div className="flex flex-row items-center justify-start gap-2">
                                                <CardTitle className="text-[#0969da]">
                                                    {repo.name}
                                                </CardTitle>
                                                {repo.fork && (
                                                    <GitBranchIcon
                                                        size={15}
                                                        color={"#0969da"}
                                                    />
                                                )}
                                            </div>
                                            <CardDescription>
                                                {" "}
                                                {repo.language}{" "}
                                            </CardDescription>
                                        </div>
                                        {/** Repo Description */}
                                        <CardDescription>
                                            {repo.description ? (
                                                <p>
                                                    {`${repo.description?.slice(0, 100)} ${repo.description?.length > 100
                                                        ? "..."
                                                        : ""
                                                        }`}
                                                </p>
                                            ) : (
                                                <p className="opacity-50 italic">
                                                    {`No Description`}
                                                </p>
                                            )}
                                        </CardDescription>
                                        {/** Repo Visibility */}
                                        <div className="absolute bottom-2 rounded-full border left-6 bg-white dark:bg-customGray-900">
                                            <div className="text-sm py-1 px-2">
                                                {repo.private ? "Private" : "Public"}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
};

export default GitHubStatus;