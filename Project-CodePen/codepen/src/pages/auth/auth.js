import "./auth.css"
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionFullLogin } from '../../Thunks/actionFullLogin.js';
import { actionFullRegister } from '../../Thunks/actionFullRegister.js';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory()

const LoginForm = ({choiceAuth, setChoiceAuth}) =>{
    const dispatch = useDispatch()
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const handleLogin = async () => {
        const checkError = await dispatch(actionFullLogin(login, password))
        if(checkError){
            setError(true)
            setLogin("")
            setPassword("")
        }else{
            history.push("/")
        }
    }

    return (
        <div className='registerAndLogin'>
            <div className='choice'>
                <p style={{cursor:"pointer"}} onClick={() => setChoiceAuth(!choiceAuth)}>Register</p>
                <span className='lineAuth'></span>
                <p style={{color:"black"}}>Login</p>
            </div>
            <h2>Login</h2>
            <div className='form'>
                <input type="text" style={{ border: error ? "1px solid red" : "" }} value={login} onChange={(e) => {setLogin(e.target.value); setError(false)}} placeholder={error ? "Wrong login or password" : 'login'}/>
                <input type="password" style={{ border: error ? "1px solid red" : "" }} value={password} onChange={(e) => {setPassword(e.target.value); setError(false)}} placeholder={error ? "Wrong login or password" : 'password'}/>
                <button disabled={(login && password) ? false : true} onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}

const RegisterForm = ({choiceAuth, setChoiceAuth}) =>{
    const dispatch = useDispatch()
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [passwordCheck, setPasswordCheck] = useState("")
    const [error, setError] = useState(false)
    const handleRegister = async () => {
        const checkError = await dispatch(actionFullRegister(login, password))
        if(checkError){
            setError(true)
            setLogin("")
            setPassword("")
            setPasswordCheck("")
        }else{
            history.push("/")
        }
    }

    return (
        <div className='registerAndLogin'>
            <div className='choice'>
                <p style={{color:"black"}}>Register</p>
                <span className='lineAuth'></span>
                <p style={{cursor:"pointer"}} onClick={() => setChoiceAuth(!choiceAuth)}>Login</p>
            </div>
            <h2>Register</h2>
            <div className='form'>
                <input type="text" style={{ border: error ? "1px solid red" : "" }} value={login} onChange={(e) => {setLogin(e.target.value); setError(false)}} placeholder={error ? "This user already exists" : 'login'}/>
                <input type="password" style={{ border: error ? "1px solid red" : "" }} value={password} onChange={(e) => {setPassword(e.target.value); setError(false)}} placeholder={error ? "This user already exists" : 'password'}/>
                <input type="password" style={{ border: error ? "1px solid red" : "" }} value={passwordCheck} onChange={(e) => {setPasswordCheck(e.target.value); setError(false)}} placeholder={error ? "This user already exists" : 'password check'}/>
                <button disabled={(login && password && passwordCheck) ? false : true} onClick={handleRegister}>Register</button>
            </div>
        </div>
    )
}

export default function() {
    const [choiceAuth, setChoiceAuth] = useState(false)
    return <main className='mainAuth'>
        <div className='containerAuth'>
            {choiceAuth ? <RegisterForm choiceAuth={choiceAuth} setChoiceAuth={setChoiceAuth}/> : <LoginForm choiceAuth={choiceAuth} setChoiceAuth={setChoiceAuth}/>}
        </div>
    </main>
}