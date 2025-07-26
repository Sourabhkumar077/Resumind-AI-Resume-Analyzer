import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { Navbar, ResumeCard } from "~/components/index"; // Assuming components exist
import { resumes } from "../../constants"; // Assuming constants exist

export function meta() {
  return [
    { title: "Resumind" },
    { name: "description", content: "Track your job applications." },
  ];
}

export default function Home() {
  const { isLoading, auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    // CRITICAL FIX: Only check authentication after loading is complete.
    if (!isLoading && !auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  // CRITICAL FIX: Render a loading state to prevent the redirect loop.
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover flex justify-center items-center">
        <h1 className="text-white text-2xl">Loading...</h1>
      </main>
    );
  }

  // This content is only shown when loading is false and the user is authenticated.
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Track your applications & resume rating</h1>
          <h2>Review your submissions and check AI powered feedback</h2>
        </div>
      </section>
      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}