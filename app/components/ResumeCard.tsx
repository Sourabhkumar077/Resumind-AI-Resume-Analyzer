import { Link } from "react-router"
import ScoreCircle from "./ScoreCircle"


const ResumeCard = ({ resume: { id, companyName, jobTitle, imagePath, resumePath, feedback } }: { resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black font-bold break-words">{companyName}</h2>
                    <h3 className="text-lg text-gray-500">{jobTitle}</h3>
                </div>

                <div className="flex-shirnk-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="h-full w-full">
                    <img src={imagePath} alt="resume image" className="w-full h-[350px] max-sm:h-[200px] object-cover object-top" />
                </div>
            </div>
        </Link>
    )
}

export default ResumeCard