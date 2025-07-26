import { useState } from 'react';
import { Navbar } from '~/components';

const upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');

    // form handling function
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        return 0;
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
                                    <textarea maxLength={5} rows={5} name="job-description" placeholder='Enter job description'></textarea>
                                </div>
                                <div className='form-div'>
                                    <label htmlFor="uploader">Upload your Resume</label>
                                    <div>upload</div>
                                </div>

                                <button className='primary-button' type='submit'>Analyizeresume</button>
                            </form>
                        )
                    }
                </div>
            </section>
        </main>
    )
}

export default upload