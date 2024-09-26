import "./project.css";
import React, { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import { Accordion, AccordionSummary, AccordionDetails, Button, CircularProgress } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { useSnippetOneQuery, useCreateSnippetMutation } from '../../Redux/api.js';
import { useSelector } from "react-redux";
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import { DND } from "../../DND.js";

const Textarea = ({ Icon, colorIcon, code, value, onChange }) => {
    return (
        <div className="contentArea">
            <h2>
                <Icon sx={{ fontSize: "24px", verticalAlign: 'middle', marginRight: '5px', color: colorIcon || "white" }} />
                <span>{code}</span>
            </h2>
            <AceEditor
                setOptions={{ useWorker: false }}
                mode={code.toLowerCase()}
                theme="monokai"
                value={value}
                onChange={newValue => onChange(newValue)}
                name={`editor-${code.toLowerCase()}`}
                editorProps={{ $blockScrolling: true }}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

function createIframeContent(html, css, js) {
    return (
        `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                        body { background: white }
                        ${css}
                    </style>
                </head>
                <body>${html}
                    <script>${js}</script>
                </body>
            </html>`
    );
}

function Project({ project }) {
    const owner = useSelector((state) => state.auth.payload.sub.id);
    const [createSnippet] = useCreateSnippetMutation();
    
    const [html, setHtml] = useState(project.files.find(file => file.type === 'HTML')?.text || '');
    const [css, setCss] = useState(project.files.find(file => file.type === 'CSS')?.text || '');
    const [js, setJs] = useState(project.files.find(file => file.type === 'JS')?.text || '');

    const [items, setItems] = useState([
        { id: 'html', content: <Textarea Icon={CodeIcon} colorIcon="red" code="HTML" value={html} onChange={setHtml} /> },
        { id: 'css', content: <Textarea Icon={IntegrationInstructionsOutlinedIcon} colorIcon="skyBlue" code="CSS" value={css} onChange={setCss} /> },
        { id: 'js', content: <Textarea Icon={DataObjectOutlinedIcon} colorIcon="orange" code="JS" value={js} onChange={setJs} /> }
    ]);

    let time = new Date(Number(project.createdAt));
    const options = { month: 'long' };
    const monthName = time.toLocaleString('en-US', options);

    const updatedFiles = [
        { type: 'HTML', text: html },
        { type: 'CSS', text: css },
        { type: 'JS', text: js }
    ];

    return (
        <div className='containerProject'>
            <h2 className="nameProject">Project: {project.title ? project.title : "Anon project"}</h2>

            <Accordion sx={{ width: '50%', transform: 'translate(50%)', marginBottom: "15px", background: "#3F3F3F", color: "white", fontSize: "18px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />} aria-controls="panel1-content" id="panel1-header">Description</AccordionSummary>
                <AccordionDetails sx={{ lineHeight: "25px" }}>
                    Author: <Link sx={{ textDecoration: "none", cursor: "pointer" }} to={`/profile/${project.owner._id}`}><span style={{ color: "white" }}>{project.owner.login}</span></Link> <br />
                    Project creation: {`${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`} | {`${monthName} ${String(time.getDate()).padStart(2, '0')} ${time.getFullYear()}`} <br />
                    {project.description && <>Description of the project by author: <br />
                        {project.description}</>}
                </AccordionDetails>
            </Accordion>

            <DND items={items} keyField="id" onChange={setItems} />

            <div className='centerIframeContent'>
                <div className='containerIframeContent'>
                    <div className="iframeContent">
                        <iframe srcDoc={createIframeContent(html, css, js)}></iframe>
                    </div>
                    <div className="iframeAttributers">
                        <div>
                            {owner !== project.owner._id ? <Button onClick={() => createSnippet({ title: project.title, description: project.description, files: updatedFiles })} variant="contained" color="success" sx={{ fontSize: "15px" }}>Save</Button> : ""}
                        </div>
                        <p>Author:
                            <Link style={{ textDecoration: "none", color: "white" }} to={`/profile/${project.owner._id}`}>{project.owner.login}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function () {
    const { id } = useParams();
    const { isLoading, data } = useSnippetOneQuery({ _id: id });
    return isLoading ? <CircularProgress /> : <Project project={data.SnippetFindOne} />
}
