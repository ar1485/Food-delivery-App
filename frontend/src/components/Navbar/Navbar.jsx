import { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const { getTotalCartAmount, token, role } = useContext(StoreContext)
    const navigate = useNavigate();

    return (
        <div className='navbar'>
            <Link to='/' className='navbar-logo-link'>
                <img src={assets.logo} alt="AR_Food Logo" className='header-logo' />
            </Link>
            
            <ul className='navbar-menu'>
                <Link to='/' onClick={() => setMenu("home")} className={menu === 'home' ? 'active' : ''}>Home</Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === 'menu' ? 'active' : ''}>Menu</a>
                <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === 'mobile-app' ? 'active' : ''}>Mobile-App</a>
                <a href='#footer' onClick={() => setMenu("contact us")} className={menu === 'contact us' ? 'active' : ''}>Contact Us</a>
            </ul>

            <div className="navbar-right">
                {role === 'admin' ? (
                    <button onClick={() => navigate('/admin/orders')} className="admin-btn">
                        Admin Portal
                    </button>
                ) : (
                    <div className='navbar-search-icon'>
                        <Link to='/Cart'><img src={assets.basket_icon} alt="" /></Link>
                        <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                    </div>
                )}

                {!token ? (
                    <button className="signin-btn" onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
                    <div className='navbar-profile'>
                        <img 
                            onClick={() => navigate('/profile')} 
                            src={assets.profile_icon} 
                            alt="Profile" 
                            className="profile-icon" 
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar