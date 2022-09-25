export default function Register() {

    const handleSubmit = (event) => {

    }
    return (
        <div className="register-screen">
            <div className='register-blur'></div>
            <div className="register-modal">
                <span className="register-label">Email</span>
                <input id="email" className='register-field' type="text"></input>
                <span className="register-label">Username</span>
                <input id="username" className='register-field' type="text"></input>
                <span className="register-label">Password</span>
                <input id="password" className='register-field' type="text"></input>
                <span className="register-label">Verify Password</span>
                <input id="password-verify" className='register-field' type="text"></input>
                <button className='register-btn'>Sign Up</button>
            </div>
        </div>
    )
}