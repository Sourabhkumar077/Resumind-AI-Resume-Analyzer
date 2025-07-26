import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
  { title: "Resumind | Auth" },
  { name: "description", content: "Log in to Resumind" }
]);

const AuthPage = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  // FIX #1: Use URLSearchParams for robust parsing.
  const params = new URLSearchParams(location.search);
  // FIX #2: Provide a fallback route ('/') if 'next' is not specified.
  const next = params.get('next') || '/';

  useEffect(() => {
    // FIX #3: Only redirect after loading is complete to prevent UI flashes.
    if (!isLoading && auth.isAuthenticated) {
      navigate(next);
    }
  }, [isLoading, auth.isAuthenticated, next, navigate]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <button className="auth-button animate-pulse" disabled>
          <p>Loading...</p>
        </button>
      );
    }
    if (auth.isAuthenticated) {
      // This button will show briefly before the redirect happens.
      return (
        <button className="auth-button" onClick={auth.signOut}>
          <p>Log out</p>
        </button>
      );
    }
    return (
      <button className="auth-button" onClick={auth.signIn}>
        <p>Log in</p>
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover flex justify-center items-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white p-10 rounded-2xl">
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1>Welcome</h1>
            <h2>Log In to continue your job journey</h2>
          </div>
          <div>
            {renderContent()}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthPage;