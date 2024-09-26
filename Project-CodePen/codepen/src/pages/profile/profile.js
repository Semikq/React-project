import "./profile.css"
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Button, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { logout } from '../../Redux/reducers/authReducer.js'
import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUserQuery, useUserSnippetsQuery, useChangeImageMutation } from "../../Redux/api.js";
import { createBrowserHistory } from 'history';
import { useState } from "react";
const history = createBrowserHistory()

function createIframeContent(files){
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
                      body{
                          font-size: 8px;
                          background: white;
                      }
                  </style>
              </head>
              <body>${htmlContent}</body>
          </html>`
  )
}

async function uploadFile(file, token){
  console.log(token)
  const fd = new FormData
   fd.append("photo", file)
    const result = await fetch('/upload', {
      method: "POST",
      headers: token ? {Authorization: 'Bearer ' + token} : {},
      body: fd
    })
    return result.json()
}

function Basic({profile}) {
  const token =useSelector(state => state.auth.token)
  const {acceptedFiles, getRootProps} = useDropzone();
  const [updateChangeImage] = useChangeImageMutation()

  useEffect(() => {
    if(acceptedFiles.length !== 0){
      uploadFile(acceptedFiles[0], token).then(res => updateChangeImage({image:{_id: res._id, userAvatar:{_id: profile._id,}}}))
    }
  },[acceptedFiles])

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <Avatar sx={{ width: 85, height: 85 }} alt={profile.login} src={`/${profile.avatar?.url || ""}`} />
      </div>
    </section>
  );
}


function CreateProfile() {
    const dispatch = useDispatch()
    const [skip, setSkip] = useState(0);
    const owner = useSelector((state) => state.auth.payload.sub.id)
    const { id } = useParams();
    const { isLoading, data } = useUserQuery({ _id: id });
    const { isLoading: isLoadingSnippets, data: Snippets } = useUserSnippetsQuery({skip, _id: id })

    if(isLoading, isLoadingSnippets) return <CircularProgress/>
    const user = data.UserFindOne
    const snippets = Snippets.SnippetFind

    let time = new Date(Number(user.createdAt))
    const options = { month: 'long' };
    const monthName = time.toLocaleString('en-US', options);

    return <div className='profile'>
      <div className='profileHeader'>
        <div className='userInfo'>
          <p>Profile: {user.login}</p>
          <p>Projects: {snippets.length}</p>
          <p>Create profile: {`${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`} | {`${monthName} ${String(time.getDate()).padStart(2, '0')} ${time.getFullYear()}`}</p>
        </div>
        <div className='profileImg'>
          <Basic profile={user}/>
          {id === owner ? (
            <Button sx={{ height: "25px", color: "rgb(223, 221, 221)", border: "1px solid gray", borderColor: "rgb(223, 221, 221)",
                '&:hover': {
                  color: "white",
                  borderColor: "white",
                  backgroundColor: "rgb(100, 100, 100)"
                }
              }} onClick={() => {dispatch(logout()); history.push("/")}} variant="outlined">Exit</Button>
          ) : ""}
        </div>
      </div>
      <div className='ListSnippets'>
        <h1>Project {user.login}</h1>
        <div className='profileSnippets'>
          {snippets.map((Snippet, index) => {
            let time = new Date(Number(user.createdAt));
            const options = { month: 'long' };
            const monthName = time.toLocaleString('en-US', options);
            const descriptionFinished = Snippet.description ? `${((Snippet.description.split("")).slice(0, 96)).join("")}...` : "Without description";

            return (
              <div className="projectCart" key={index}>
                <Link to={`/edit-my-project/${Snippet._id}`} className="link">
                  <h2>{Snippet.title || `Anon ${index + 1}`}</h2>
                  <iframe frameBorder="0" width="100%" height="150" srcDoc={createIframeContent(Snippet.files || [])}></iframe>
                  <p className='description'>{descriptionFinished}</p>
                </Link>
                <div className="userContainer">
                  <p>
                    {`${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`}
                    <br />
                    {`${monthName} ${String(time.getDate()).padStart(2, '0')} ${time.getFullYear()}`}
                  </p>
                </div>
              </div>
            );})}
        </div>
      </div>
    </div>
}

export default function() {
  return <CreateProfile/>
}