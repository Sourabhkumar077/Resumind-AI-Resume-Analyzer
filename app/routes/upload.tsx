import { useState } from 'react';
import { Navbar, FileUploader } from '~/components';

const upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // form handling function
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;

        const formData = new FormData(form);
        const companyName = formData.get('companyName');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description');

        console.log({
            companyName,
            jobTitle,
            jobDescription,
            file
        });
        
    }

    const handleFileSelect = (file: File | null) => {
        setFile(file);
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
                                    <textarea  rows={5} name="job-description" placeholder='Enter job description'></textarea>
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