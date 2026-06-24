import { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken, setRole } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [isAdminMode, setIsAdminMode] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user" 
    })

    const onChangeHandler = (event) => {
        setData(data => ({ ...data, [event.target.name]: event.target.value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url + (currState === "Login" ? "/api/user/login" : "/api/user/register")
        const submitData = isAdminMode ? { ...data, role: "admin" } : data;
        
        const response = await axios.post(newUrl, submitData);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            const userRole = response.data.role || "user";
            setRole(userRole);
            localStorage.setItem("role", userRole);
            setShowLogin(false)
        } else {
            alert(response.data.message)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{isAdminMode ? "Admin Access" : currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                
                <div className="admin-toggle" onClick={() => setIsAdminMode(!isAdminMode)}>
                    {isAdminMode ? "Switch to Customer Login" : "Are you an Admin? Login here"}
                </div>

                {currState === "Sign Up" && !isAdminMode && (
                    <div className="login-popup-role">
                        <div onClick={() => setData(prev => ({...prev, role: "user"}))} className={data.role === "user" ? "role-btn active" : "role-btn"}>Customer</div>
                        <div onClick={() => setData(prev => ({...prev, role: "admin"}))} className={data.role === "admin" ? "role-btn active" : "role-btn"}>Restaurant Admin</div>
                    </div>
                )}
                
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && !isAdminMode && <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Username' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>

                <button type='submit'>{isAdminMode ? "Login to Dashboard" : (currState === "Sign Up" ? "Create account" : "Login")}</button>
                
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of service & privacy policy.</p>
                </div>
                
                {!isAdminMode && (currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup