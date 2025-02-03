// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { columns, DataTable } from "./repo-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
  Working on a posture-recognition + object detection project for
  cell phone usage detection.
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
                  pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Names & Info */}
        <div className="flex flex-row w-full items-center justify-between">
          {/* Basic Info */}
          <div>
            <p className="font-bold text-[2rem]">{personalInfo.name}</p>
            <div className="flex flex-row w-full gap-3">
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

        {/** Github stats */}
        <div className="flex flex-row gap-2">
          {/** Left Panel */}
          <div className="flex flex-row w-[50%]">
            <Card >
              <CardHeader>
                <CardTitle>Github Statis</CardTitle>
                <CardDescription>Status of GitHub Account</CardDescription>
              </CardHeader>
              <CardContent>
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
                <div>
                  <div className="flex flex-row w-full items-center justify-top py-6">
                    <p className="font-bold text-[1.2rem]">Personal Repos</p>
                  </div>
                  <div className="container mx-auto">
                    {reposData != null ? (
                      <DataTable columns={columns} data={reposData} />
                    ) : (
                      <p>Failed to fetch repositories.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/** Right Panel */}
          <div className="flex flex-col w-[50%] gap-2">
            {/** Intorduction */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
                <CardDescription>Card Description</CardDescription>
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
