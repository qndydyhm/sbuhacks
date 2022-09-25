export default function Login() {

    const handleSubmit = (event) => {

    }
    return (
      <div className="login-screen">
        <div className='login-blur'></div>
        <div className="login-modal">
          <span className="login-label">Email</span>
            <input id="email" className='login-field' type="text"></input>
          <span className="login-label">Password</span>
            <input id="password" className='login-field' type="text"></input>
          <button className='login-btn'>Login</button>
        </div>
      </div>
    )
}