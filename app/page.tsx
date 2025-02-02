// Shadcn
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { columns, DataTable } from "./repo-table";

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
  github: "YanzhenHuang",
};

export default async function Home() {
  // User data
  const githubUserData: GitHubUserData = await fetch(
    "https://api.github.com/users/YanzhenHuang",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    }
  ).then((res) => res.json());

  // Repo list
  const reposData: GitHubRepoData[] = await fetch(
    githubUserData.repos_url,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    }
  ).then((res) => res.json())
    .catch((error) => {
      // console.error(`Error fetching repositories: ${error}.`);
      console.log(error);
      return [];
    });

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 
                  pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Names & Info */}
        <div className="flex flex-row w-full items-center justify-between">
          {/* Basic Info */}
          <div>
            <p className="font-bold text-[2rem]">{personalInfo.name}</p>
            <Link href={`mailto:${personalInfo.email.work[0]}`}>
              {personalInfo.email.work[0]}
            </Link>
          </div>

          {/*Avatar */}
          <Avatar>
            <AvatarImage src="https://s2.loli.net/2025/02/03/kVnMuKbh9OecvZY.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Stats */}
        <ResizablePanelGroup
          direction="horizontal"
          className="max-w-md min-w-[800px] rounded-lg border">
          {/* Left main panel */}
          <ResizablePanel defaultSize={50}>
            <div className="flex flex-col h-[500px] items-top justify-start p-6">
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
              <div>
                {/** Repositories */}
                <div className="container mx-auto py-7">
                  {reposData != null ? (
                    <DataTable columns={columns} data={reposData} />
                  ) : (
                    <p>Failed to fetch repositories.</p>
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right divided panel */}
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              {/* Upper panel */}
              <ResizablePanel defaultSize={25}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Work In Progress</span>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Lower panel */}
              <ResizablePanel defaultSize={75}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Work In Progress</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>
          This webpage is built with next.js and shadcn.
        </p>
      </footer>
    </div>
  );
}
