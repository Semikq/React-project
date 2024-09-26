import "./editProject.css"
import React, { useState} from 'react';
import {Button, CircularProgress} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import { useParams, useHistory } from 'react-router-dom';
import { useSnippetOneQuery, useUpdateSnippetMutation } from '../../Redux/api.js';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import { DND } from "../../DND.js";

function createIframeContent(html, css, js){
    return (
        `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                    body{
                        background: white;
                    }
                        ${css}
                    </style>
                </head>
                <body>${html}
                    <script>${js}</script>
                </body>
            </html>`
    )
}

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

function UpdateProject({project}){
    const {id} = useParams()
    const history = useHistory()
    const [textarea, setTextarea] = useState(project.description)
    const [error, setError] = useState(false)
    const [title, setTitle] = useState(project.title || "Anon")
    const [updateSnippet] = useUpdateSnippetMutation();

    const [html, setHtml] = useState(project.files.find(file => file.type === 'HTML')?.text || '');
    const [css, setCss] = useState(project.files.find(file => file.type === 'CSS')?.text || '');
    const [js, setJs] = useState(project.files.find(file => file.type === 'JS')?.text || '');

    const [items, setItems] = useState([
        { id: 'html', content: <Textarea Icon={CodeIcon} colorIcon="red" code="HTML" value={html} onChange={setHtml} /> },
        { id: 'css', content: <Textarea Icon={IntegrationInstructionsOutlinedIcon} colorIcon="skyBlue" code="CSS" value={css} onChange={setCss} /> },
        { id: 'js', content: <Textarea Icon={DataObjectOutlinedIcon} colorIcon="orange" code="JS" value={js} onChange={setJs} /> }
    ]);

    const updatedFiles = [
        { type: 'HTML', text: html },
        { type: 'CSS', text: css },
        { type: 'JS', text: js }
    ];

    const handleSave = async () => {
        const result = await updateSnippet({ _id: id, title, description: textarea, files: updatedFiles });
        if (result.data) {
            history.push(`/profile/${project.owner._id}`);
        } else {
            setError(true)
        }
    };

    return <div className='containerProject'>
        <h2 className="nameProject">
            Project: 
            <input className='editNameProject' value={title} onChange={(e) => setTitle(e.target.value)}/>
        </h2>

        <DND items={items} keyField="id" onChange={setItems} />

        <div className='centerIframeContent'>
            <div className='containerIframeContent'>
                <div className="iframeContent">
                    <iframe srcDoc={createIframeContent(html, css, js)}></iframe>
                </div>
                <div className='contDescription'>
                    <div>
                        <h2>Description</h2>
                        <textarea value={textarea} onChange={(e) => setTextarea(e.target.value)}/>
                    </div>
                    <div>
                        <Button sx={{ backgroundColor: "#228c3e",
                            color: 'white',
                            '&:hover': {
                                backgroundColor: "#228c3e",
                        }}} onClick={handleSave} disabled={error ? true : false}>{error ? "Server error" : " To edit"}</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default function(){
    const {id} = useParams()
    const {isLoading, data} = useSnippetOneQuery({_id:id})
    return isLoading ? <CircularProgress/> : <UpdateProject project={data.SnippetFindOne}/>
}