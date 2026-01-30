import { personalInfo } from "@/data/static/personal_info";
import IntroCard from "@/components/IntroCard";
import GitHubStatus from "@/contents/GitHubStatus";
import Education from "@/contents/Education";
import GitHubOrgs from "@/contents/GitHubOrgs";
import PersonalInfo from "@/contents/PersonalInfo";
import Prizes from "@/contents/Prizes";
import LLM from "@/contents/LLM";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";

interface PageProps {
  params: { locale: Locale };
}

export default async function Home({ params }: PageProps) {

  // Get language dictionary
  const dict = await getDictionary((await params).locale);


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
        <PersonalInfo personalInfo={personalInfo} dict={dict}/>

        {/** Card Panels */}
        <div className={`flex flex-col gap-2 w-full max-w-[800px]`}>
          <IntroCard
            cardTitle={dict.llm.card_title}
            cardDescription={dict.llm.card_subtitle}
            hoverCardProps={{
              description: dict.llm.powered_by,
              date: `2025/07/29`,
            }}>
            <LLM dict={dict} />
          </IntroCard>

          {/** Github Status */}
          <IntroCard
            cardTitle={dict.github_status.card_title}
            cardDescription={dict.github_status.card_subtitle}>
            <GitHubStatus githubUserData={githubUserData} reposData={reposData} />
          </IntroCard>

          {/** Intorduction */}
          <IntroCard cardTitle={dict.intro_card.card_title} cardDescription={dict.intro_card.card_subtitle}>
            <div className="flex flex-col h-full items-center justify-top">
              <p className="text-justify">{dict.intro_card.intro}</p>
            </div>
          </IntroCard>

          {/** Education */}
          <IntroCard cardTitle={dict.education.card_title} cardDescription={dict.education.card_subtitle}>
            <Education education={personalInfo.education} />
          </IntroCard>

          {/** Prizes */}
          <IntroCard cardTitle={dict.prizes.card_title} cardDescription={dict.prizes.card_subtitle}>
            <Prizes prizes={personalInfo.prizes} />
          </IntroCard>

          {/** Projects */}
          <IntroCard
            cardTitle={dict.projects.card_title}
            cardDescription={dict.projects.card_subtitle}>
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
