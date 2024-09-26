import "./projects.css";
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, CircularProgress, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addBatch, clearFeed } from '../../Redux/reducers/feedSlice';
import { Link } from 'react-router-dom';
import { useSnippetsQuery } from '../../Redux/api';

function createIframeContent(files) {
    const htmlContent = files.find(file => file.type === 'HTML')?.text || '';
    const cssContent = files.find(file => file.type === 'CSS')?.text || '';

    return (
        `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                        ${cssContent}
                        body {
                            font-size: 8px;
                            background: white;
                        }
                    </style>
                </head>
                <body>${htmlContent}</body>
            </html>`
    );
}

function RenderSnippet({ snippet }) {
    let time = new Date(Number(snippet.createdAt));
    const options = { month: 'long' };
    const monthName = time.toLocaleString('en-US', options);
    const descriptionFinished = snippet.description ? `${((snippet.description.split("")).slice(0, 96)).join("")}...` : "Without description";

    return (
        <div className="projectCart">
            <Link to={`/project/${snippet._id}`} className="link">
                <h2>{snippet.title || `Anon`}</h2>
                <iframe frameBorder="0" width="100%" height="150" srcDoc={createIframeContent(snippet.files || [])}></iframe>
                <p className='description'>{descriptionFinished}</p>
            </Link>
            <div className="userContainer">
                <p>{`${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`}
                <br />
                {`${monthName} ${String(time.getDate()).padStart(2, '0')} ${time.getFullYear()}`}</p>
                <Link to={`/profile/${snippet.owner._id}`} className="link">
                    <Avatar className='avatar' alt={snippet.owner.login} src={snippet.owner.avatar?.url || ""} />
                </Link>
            </div>
        </div>
    );
}

export default function SnippetList() {
    const dispatch = useDispatch();
    const [skip, setSkip] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const { data, isLoading } = useSnippetsQuery({ skip, searchQuery });
    const containerRef = useRef(null);
    const state = useSelector((state) => state.feed);

    useEffect(() => {
        if (data && data.SnippetFind.length > 0) {
            dispatch(addBatch(data.SnippetFind));
        }
    }, [data, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (container) {
                const nearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
                if (nearBottom && !isLoading && !searchQuery) {
                    setSkip(prevSkip => prevSkip + 20);
                }
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoading, searchQuery]);

    useEffect(() => {
        return () => {
            dispatch(clearFeed());
        };
    }, [dispatch]);

    function handleSearch(event) {
        const query = event.target.value;
        setSearchQuery(query);
        setSkip(0);
        dispatch(clearFeed());
    }

    if (isLoading) return <CircularProgress />;

    return (
        <div className='project'>
        <div className='search'>
        <TextField id="outlined-multiline-flexible" label="Search" multiline maxRows={4} value={searchQuery} onChange={handleSearch} sx={{
                margin: "10px 20px 10px 20px", width: "400px", color: "white",
                '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                    borderColor: 'white', 
                },
                },'& .MuiInputLabel-root': {
                color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
                },
            }}
        />
        </div>
        <div className="containerSnippets" ref={containerRef}>
            {state.map((project, index) => <RenderSnippet snippet={project} key={index} />)}
        </div>
        </div>
    );
}