import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState, useMemo } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
]);

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [isLoading, auth.isAuthenticated, navigate, id]);

    useEffect(() => {
        let resumeUrlObject: string | null = null;
        let imageUrlObject: string | null = null;

        const loadResume = async () => {
            if (!id) return;

            try {
                const resumeDataString = await kv.get(`resume:${id}`);
                if (!resumeDataString) return;

                const data = JSON.parse(resumeDataString);

                const resumeBlob = await fs.read(data.resumePath);
                if (resumeBlob) {
                    const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                    resumeUrlObject = URL.createObjectURL(pdfBlob);
                    setResumeUrl(resumeUrlObject);
                }

                const imageBlob = await fs.read(data.imagePath);
                if (imageBlob) {
                    imageUrlObject = URL.createObjectURL(new Blob([imageBlob]));
                    setImageUrl(imageUrlObject);
                }
                
                const feedbackData = typeof data.feedback === "string" ? JSON.parse(data.feedback) : data.feedback;
                setFeedback(feedbackData);

            } catch (error) {
                console.error("Failed to load resume data:", error);
            }
        };

        loadResume();

        return () => {
            if (resumeUrlObject) URL.revokeObjectURL(resumeUrlObject);
            if (imageUrlObject) URL.revokeObjectURL(imageUrlObject);
        };
    }, [id, fs, kv]);

    const memoizedFeedback = useMemo(() => feedback, [feedback]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav p-4"> {/* Added padding for mobile */}
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            {/* On small screens, it's a column. On large screens (lg), it's a row. */}
            <div className="flex flex-col lg:flex-row w-full">
                {/* Section 1: Resume Image */}
                {/* On mobile, it takes full width. On large screens, it takes half width and is sticky. */}
                <section className="w-full lg:w-1/2 p-4 lg:sticky lg:top-0 lg:h-screen flex items-center justify-center bg-[url('/images/bg-small.svg')] bg-cover">
                    {imageUrl && resumeUrl && (
                        <div className="gradient-border w-full max-w-lg h-full"> {/* Use max-width to control size */}
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                
                {/* Section 2: Feedback Details */}
                {/* On mobile, it takes full width. On large screens, it takes the other half. */}
                <section className="w-full lg:w-1/2 p-6 md:p-8"> {/* Added more padding */}
                    <h2 className="text-3xl md:text-4xl !text-black font-bold mb-6">Resume Review</h2> {/* Responsive text size */}
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    );
};
export default Resume;