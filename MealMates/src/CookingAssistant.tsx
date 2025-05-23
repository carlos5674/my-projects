import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './styles/assistant.css';

const CookingAssistant = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [recipe, setRecipe] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [placeholder, setPlaceholder] = useState("What can I help you with?");
    const [image, setImage] = useState(null);
    const [wantsVideo, setWantsVideo] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [history, setHistory] = useState([]);
    const chatScrollRef = useRef(null);
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async () => {
        const hasImage = !!image;
        const hasRecipe = !!recipe;
        const hasPrompt = !!question;

        let endpoint = '';
        let auth = '';
        if (hasPrompt && hasRecipe && hasImage) {
            endpoint = 'https://noggin.rea.gent/armed-alligator-2483';
            auth = 'Bearer rg_v1_8xqo78kfwzwh5sxfvvmuhk5c1gmx0xnb1tow_ngk'
        } else if (hasPrompt && hasRecipe) {
            endpoint = 'https://noggin.rea.gent/delicious-prawn-3791';
            auth = 'Bearer rg_v1_m3g9via3gvhzmkp0ozmra1wemxjc0l8eyg82_ngk'
        } else if (hasPrompt && hasImage) {
            endpoint = 'https://noggin.rea.gent/everyday-walrus-7152';
            auth = 'Bearer rg_v1_n74mhbou38d9ydsygfmr00rydqixzf5ydm13_ngk'
        } else if (hasPrompt) {
            endpoint = 'https://noggin.rea.gent/inclined-bovid-7706';
            auth = 'Bearer rg_v1_g7sesbok4t2j20xsmiauo2zx5w93i4tza9b1_ngk'
        } else {
            console.error("Missing required input: text prompt");
            return;
        }

        const formData = {
            text: question,
            recipie: hasRecipe ? recipe : undefined,
            image: hasImage ? URL.createObjectURL(image) : undefined,
            videoPreferred: wantsVideo
        };

        Object.keys(formData).forEach(key => formData[key] === undefined && delete formData[key]);

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: auth,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to fetch response');

            let data = await res.text();
            if (wantsVideo) {
                data = "https://www.youtube.com/watch?v=P6W8kwmwcno";
            }

            setHistory(prev => [...prev, { question, response: data }]);
            setSubmitted(true);
            setQuestion('');
            setPlaceholder('Ask me anything!');
        } catch (error) {
            console.error('Error:', error);
            setResponse('Sorry, something went wrong. Please try again.');
            setSubmitted(true);
        }
    };

    // Function to handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    // Function to reset everything for a new question
    const handleNewQuestion = () => {
        setQuestion('');
        setResponse('');
        setImage(null);
        setSubmitted(false);
        setHistory([]);
        setShowOptions(false);
        setWantsVideo(false);
    };

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [history]);

    return (
        <div className='assistant-container'>
            <h1>Cooking Assistant</h1>

            <div className='input-area'>
                {!submitted ? (
                    <div>
                        <textarea
                            id='question-input'
                            rows={4}
                            cols={50}
                            placeholder="What can I help you with?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div className='input-actions'>
                            <label htmlFor='file-upload'>
                                + Upload Picture
                                <input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <button id='recipie-button' onClick={() => setShowOptions(!showOptions)}>Select Recipe ↓</button>
                        </div>
                        <div className='checkbox-container'>
                            <input
                                type='checkbox'
                                id='video-checkbox'
                                checked={wantsVideo}
                                onChange={(e) => setWantsVideo(e.target.checked)}
                            />
                            <label htmlFor='video-checkbox'>Generate Video</label>
                        </div>
                        <button
                            id='submit-button'
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <br />
                        <button id='submit-button' onClick={() => navigate(-1)}>Back to Groups</button>
                            
                    </div>
                ) : (
                    <div className='response-area'>
                        <button id='back-button' onClick={handleNewQuestion}> &larr; </button>
                        <div className='chat-scroll-area' ref={chatScrollRef}>
                            {history.map((entry, index) => (
                                <React.Fragment key={index}>
                                    <div className='message user-message'>
                                        <p>{entry.question}</p>
                                    </div>
                                    <div className='message assistant-message'>
                                        {
                                            entry.response.startsWith('https://www.youtube.com') ? ( 
                                                <iframe
                                                    width="100%"
                                                    height="315"
                                                    src={entry.response.replace('watch?v=', 'embed/')}
                                                    title="YouTube video response"
                                                    allowFullScreen
                                                ></iframe>
                                            ) : (
                                                <p>{entry.response.split('\n').map((line, idx) => (
                                                    <span key={idx}>
                                                        {line}
                                                        <br />
                                                    </span>
                                                ))}</p>
                                            )
                                        }
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                        <div className='response-input'>
                            <div className="plus-container">
                                {showOptions && (
                                    <div className="options-popup above-plus">
                                        <label htmlFor="file-upload">
                                            📷 Upload Picture
                                            <input
                                                id="file-upload"
                                                type="file"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        <button onClick={() => {
                                            setShowOptions(false);
                                        }}>
                                            🍲 Add Recipe
                                        </button>
                                    </div>
                                )}
                                <span onClick={() => setShowOptions(!showOptions)} style={{ cursor: 'pointer' }}>+</span>
                            </div>
                            <textarea
                                id='question-input'
                                rows={1}
                                cols={50}
                                placeholder={placeholder}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                            <button onClick={handleSubmit}>↑</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CookingAssistant;