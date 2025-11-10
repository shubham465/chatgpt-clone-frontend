import { useState } from "react";
import "./Auth.css";
import {domain} from './constant'
import {useNavigate} from 'react-router-dom'

function Auth({type}) {
  const [isLogin, setIsLogin] = useState(type === "signin" ? true : false);
  const [form, setForm] = useState({name:"", email:'', password: ''})
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  const HandleClick = (e) => {
    e.preventDefault()
    if(error)
      setError(false)
    
    setForm({...form, [e.target.name]: e.target.value})
  }

  const HandleSubmit = async (e) => {
    e.preventDefault()
    const url = !isLogin ? "/api/auth/register" : "/api/auth/login" 
    try{
    const {token} = await fetch(domain + url, {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...form
    })
    }).then((res)=> res.json())
    console.log(token)
    if(!token)
      throw new Error('Email id or password is wrong')
    if(!isLogin)
      window.location.href = "/signin";
    else{
      localStorage.setItem("token", token)  
      navigate('/') 
    }
  }
  catch(err){
    setError(true)
    throw new Error(err)
  }
  }
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Welcome Back 👋" : "Create Account ✨"}</h2>
        <p className="subtitle">
          {isLogin ? "Login to continue" : "Sign up to get started"}
        </p>

        <form onSubmit={HandleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input type="text" name="name" value={form.name} onChange={HandleClick} placeholder="Full Name" required />
            </div>
          )}
          <div className="input-group">
            <input type="email" name="email" value={form.email} onChange={HandleClick} placeholder="Email Address" required />
          </div>
          <div className="input-group">
            <input type="password" name="password" value={form.password} onChange={HandleClick} placeholder="Password" required />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {!isLogin && error && <span style={{color: 'red', fontSize: '12px'}}>Email id already used</span>}
        {isLogin && error && <span style={{color: 'red', fontSize: '12px'}}>Email or password already is wrong</span>}

        <p className="switch">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span onClick={() => {
            setIsLogin(!isLogin)
            }}>
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth