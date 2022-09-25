import { useContext } from 'react';
import * as React from 'react';
import AuthContext from '../auth'
const { auth } = useContext(AuthContext);

export default function Login() {

  const handleSubmit = (event) => {
    console.log("hi")
    const loginform = {
      "password": "glissaaaa", "email": "gliaawsse"
    }
    auth.loginUser(loginform, undefined)
  }
return (
  <div className="login-screen">
    <div className='login-blur'></div>
    <div className="login-modal">
      <span className="login-label">Email</span>
      <input id="email" className='login-field' type="text"></input>
      <span className="login-label">Password</span>
      <input id="password" className='login-field' type="text"></input>
      <button className='login-btn' onClick={handleSubmit}>Login</button>
    </div>
  </div>
)
}