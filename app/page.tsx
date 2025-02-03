// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { columns, DataTable } from "./repo-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Icons
import { GitBranchIcon } from "hugeicons-react";

// React
import Link from "next/link";

const personalInfo = {
  name: "Huang Yanzhen",
  birth: "8 Jan 2003",
  phone: ["+86 17841574072", "+853 62375735"],
  email: {
    work: ["yanzhenhuangwork@gmail.com"],
    home: ["huangyanzhen0108@gmail.com", "huangyanzhen0108@163.com"],
  },
  wechat: "one_of_a_goat",
  github: "YanzhenHuang",
  education: [
    {
      institution: "University of Macau",
      url: "https://www.um.edu.mo/",
      major: "Computer Science",
      degree: "BSc",
      start_date: "Aug 2021",
      end_date: "Cur",
      gpa: "3.76/4"
    },
  ],
  intro: `Currently a computer science Year-4 student in University of 
  Macau. Pay interest in full-stack development and Machine learning. 
  Working on a posture recognition + object detection project for
  cell phone usage detection. Stay tuned!
  `,
};

export default async function Home() {
  // User data
  const githubUserData: GitHubUserData = await fetch(
    "https://api.github.com/users/YanzhenHuang",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  // Repo list
  const reposData: GitHubRepoData[] = await fetch(githubUserData.repos_url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      // console.error(`Error fetching repositories: ${error}.`);
      console.log(error);
      return [];
    });

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 
                  pb-20 max-sm:p-4 gap-16 font-[family-name:var(--font-geist-sans)]"
    >
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        {/* Names & Info */}
        <div className="flex flex-row w-full items-center justify-between">
          {/* Basic Info */}
          <div>
            <p className="font-bold text-[2rem]">{personalInfo.name}</p>
            <div className="flex min-md:flex-row max-sm:flex-col w-full gap-3">
              <Link href={`mailto:${personalInfo.email.work[0]}`}>
                {`Email: ${personalInfo.email.work[0]}`}
              </Link>
              <p>{`Phone: ${personalInfo.phone[0]}`}</p>
            </div>
          </div>

          {/*Avatar */}
          <Avatar>
            <AvatarImage src="https://s2.loli.net/2025/02/03/kVnMuKbh9OecvZY.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/** Panels */}
        <div
          className="flex gap-2 max-md:flex-col flex-row "
        // className="flex gap-2 mx-auto flex-col "
        >
          {/** Left Panel */}
          <div
            className="flex flex-col md:w-[50%] sm:w-[100%] gap-2">
            <Card >
              <CardHeader>
                <CardTitle>Github Statis</CardTitle>
                <CardDescription>Status of GitHub Account</CardDescription>
              </CardHeader>
              <CardContent>
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
                      className="flex flex-col rounded-md border w-[17.5rem] max-md:w-[15rem] max-sm:w-[14rem]"
                      opts={{
                        align: "start",
                        loop: true,
                      }}>
                      <CarouselContent className="">
                        {reposData.map((repo, id) => (
                          <CarouselItem key={id} className="relative">
                            <div className="flex flex-col gap-2 p-3 h-full">
                              <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center justify-start gap-2">
                                  <CardTitle className="text-[#0969da]">{repo.name}</CardTitle>
                                  {repo.fork && (<GitBranchIcon size={15} color={"#0969da"} />)}
                                </div>
                                <CardDescription> {repo.language} </CardDescription>
                              </div>
                              {repo.description ? (
                                <p>
                                  {`${repo.description?.slice(0,
                                    /[\u4E00-\u9FFF]/.test(repo.description) ? 100 : 120
                                  )} ${repo.description?.length > (/[\u4E00-\u9FFF]/.test(repo.description) ? 100 : 120) ?
                                    "..." : ""
                                    }
                                `}
                                </p>
                              ) : (
                                <p className="opacity-50 italic">
                                  No Description
                                </p>
                              )}
                              <div className="absolute bottom-2 left-6 bg-white">
                                <div className="text-sm py-1 px-2 rounded-full border">
                                  {repo.private ? "Private" : "Public"}
                                </div>
                              </div>
                            </div>

                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/** Right Panel */}
          <div className="flex flex-col md:w-[50%] sm:w-[100%] gap-2">
            {/** Intorduction */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
                <CardDescription>Brief self-introduction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-full items-center justify-top">
                  <p className="text-justify">{personalInfo.intro}</p>
                </div>
              </CardContent>
            </Card>

            {/** Education */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Education History</CardDescription>
              </CardHeader>
              <CardContent>
                {personalInfo.education.map((edu, index) => (
                  <Link key={index} href={edu.url} target="_blank">
                    <div className="flex flex-col w-full items-start justify-top p-2 rounded-md 
                                        hover:bg-gray-100 hover:cursor-pointer transition-all">
                      <div className="flex flex-row w-full items-center justify-between">
                        <p className="font-bold text-[1rem]">{edu.institution}</p>
                        <p>{`${edu.start_date} - ${edu.end_date}`}</p>
                      </div>
                      <div className="flex flex-row w-full items-center justify-between">
                        <p>{`${edu.major}, ${edu.degree}`}</p>
                        <p>{`GPA: ${edu.gpa}`}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>This webpage is built with next.js and shadcn.</p>
      </footer>
    </div>
  );
}
