import { useState } from 'react';
import { Navbar, FileUploader } from '~/components';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants';


const upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const { auth, kv, fs, ai } = usePuterStore();
    const navigate = useNavigate();



    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }
    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);
        setStatusText("uloading the file...");

        const uploadFile = await fs.upload([file]);
        if (!uploadFile) return setStatusText("Error :: uploading file");

        setStatusText('converting to image');
        const imageFile = await convertPdfToImage(file);

        if (!imageFile.file) return setStatusText("Error :: converting to image");

        setStatusText("Uploading the image...");

        const uploadImage = await fs.upload([imageFile.file]);
        if (!uploadImage) return setStatusText("Error :: uploading image ");

        setStatusText('preparing the data');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadFile.path,
            imagePath: uploadImage.path,
            companyName, jobTitle, jobDescription,
            feedback: ""
        }

        await kv.set(`resume-${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing the resume...');

        const feedback = await ai.feedback(
            uploadFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) {
            return setStatusText("error :: failed to analyze the resume ")
        }
        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:{uuid}`, JSON.stringify(data));
        setStatusText("Analysis completed! redirecting...");
        console.log(data);
    }

    // form handling function
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;

        const formData = new FormData(form);
        const companyName = formData.get('companyName') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        // console.log({
        //     companyName,
        //     jobTitle,
        //     jobDescription,
        //     file
        // });
        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });

    }




    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />
            <section className="main-section">
                <div className="page-heading p-16">
                    <h1>Smart feedback to your resume</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="Scanning the resume" />
                        </>
                    ) : (
                        <h2>Drop your resume for ATS score and improvement tips</h2>
                    )}

                    {
                        !isProcessing && (
                            <form action="" id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-4'>
                                <div className='form-div'>
                                    <label htmlFor="companyName">Company name</label>
                                    <input type="text" name='companyName' placeholder='Enter company name' />
                                </div>
                                <div className='form-div'>
                                    <label htmlFor="job-title">Job title</label>
                                    <input type="text" name='job-title' placeholder='Enter job title' />
                                </div>
                                <div className='form-div'>
                                    <label htmlFor="job-description">Job description</label>
                                    <textarea rows={5} name="job-description" placeholder='Enter job description'></textarea>
                                </div>
                                <div className='form-div'>
                                    <label htmlFor="uploader">Upload your Resume</label>
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>

                                <button className='primary-button' type='submit'>Analyize resume</button>
                            </form>
                        )
                    }
                </div>
            </section>
        </main>
    )
}

export default upload