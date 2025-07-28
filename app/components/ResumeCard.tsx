import { Link } from "react-router"
import ScoreCircle from "./ScoreCircle"
import { usePuterStore } from '../lib/puter'
import { useEffect, useState } from "react";


const ResumeCard = ({ resume: { id, companyName, jobTitle, imagePath, resumePath, feedback } }: { resume: Resume }) => {

    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if (!blob) return;

            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
            setIsLoading(false);
        }
        loadResume();
    }, [imagePath]);


    if (isLoading) {
        return (
            <main className="min-h-screen ...">
                <h1 className="text-white text-2xl">Loading...</h1>
            </main>
        );
    }

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>

                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback?.overallScore ?? 0} />
                </div>
            </div>

            {
                resumeUrl && (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="h-full w-full">
                            <img
                                src={resumeUrl}
                                alt="resume image"
                                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                            />
                        </div>
                    </div>
                )
            }
        </Link>
    )
}

export default ResumeCard