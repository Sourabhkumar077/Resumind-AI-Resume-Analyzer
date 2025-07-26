import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
    <section className="main-section ">
      <Navbar />
      <div className="page-heading">
        <h1>Track your applications & resume rating </h1>
        <h2>Review your submissions and check AI powered feedback</h2>
      </div>
    </section>


    {
      resumes.length > 0 &&
      <div className="resumes-section">
        {resumes.map((Resume) => (
          <ResumeCard key={Resume.id} resume={Resume} />
        ))}
      </div>
    }



  </main>;
}
