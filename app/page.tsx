import { personalInfo } from "@/data/static/personal_info";
import IntroCard from "@/components/IntroCard";
import GitHubStatus from "@/contents/GitHubStatus";
import Education from "@/contents/Education";
import GitHubOrgs from "@/contents/GitHubOrgs";
import PersonalInfo from "@/contents/PersonalInfo";
import Prizes from "@/contents/Prizes";
import LLM from "@/contents/LLM";

export default async function Home() {
  // User data
  const githubUserData: GitHubUserData = await fetch(
    "https://api.github.com/users/YanzhenHuang",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((error) => {
      // console.error(`Error fetching repositories: ${error}.`);
      console.log(error);
      return null;
    });

  // Repo list
  const reposData: GitHubRepoData[] = await fetch(githubUserData.repos_url, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      return [];
    });

  // Organizations List
  const organizationsData: GitHubOrganizationData[] = await fetch(
    githubUserData.organizations_url,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      return [];
    });

  // Hello HKUST!!!!!
  return (
    <div className="
      grid grid-rows-[20px_1fr_20px] 
      items-center justify-items-center 
      min-h-screen max-sm:p-4 gap-16 
      font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 row-start-2 items-center justify-center">
        {/* Name, Email, Phone, Avatar */}
        <PersonalInfo personalInfo={personalInfo} />

        {/** Card Panels */}
        <div className={`flex flex-col gap-2 w-full max-w-[800px]`}>
          <IntroCard 
            cardTitle={`My LLM Agent`} 
            cardDescription={`跟我的代理LLM聊聊天，简单掌握我的讯息`}
            hoverCardProps={{
              description: `Powered by Dify + Qwen-Max, using RAG.`,
              date: `2025/07/29`
            }}>
              <LLM/>
          </IntroCard>

          {/** Github Status */}
          <IntroCard
            cardTitle={`GitHub Status`}
            cardDescription={`A brief overview of my GitHub profile.`}>
            <GitHubStatus githubUserData={githubUserData} reposData={reposData} />
          </IntroCard>

          {/** Intorduction */}
          <IntroCard cardTitle={`Introduction`} cardDescription={`Brief self-introduction.`}>
            <div className="flex flex-col h-full items-center justify-top">
              <p className="text-justify">{personalInfo.intro}</p>
            </div>
          </IntroCard>

          {/** Education */}
          <IntroCard cardTitle={`Education`} cardDescription={`My education history.`}>
            <Education education={personalInfo.education} />
          </IntroCard>

          {/** Prizes */}
          <IntroCard cardTitle={`Prizes`} cardDescription={`List of prizes and awards I obtained.`}>
            <Prizes prizes={personalInfo.prizes} />
          </IntroCard>

          {/** Projects */}
          <IntroCard
            cardTitle={`Projects`}
            cardDescription={`List of projects I'm currently working with/maintained before.`}>
            <GitHubOrgs gitHubOrganizationData={organizationsData} />
          </IntroCard>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>This webpage is built with next.js and shadcn.</p>
      </footer>
    </div>
  );
}
