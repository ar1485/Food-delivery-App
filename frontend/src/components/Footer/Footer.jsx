import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt='AR_Food Logo' className='footer-logo' />
                    <p>Our mission is to deliver the best quality food to your doorstep. Our service is fast, reliable, and delicious.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt='Facebook' />
                        <img src={assets.twitter_icon} alt='Twitter' />
                        <img src={assets.linkedin_icon} alt='LinkedIn' />
                    </div>
                </div>
                
                <div className="footer-content-center">
                    <h2>Explore</h2>
                    <ul>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                
                <div className="footer-content-right">
                    <h2>Support</h2>
                    <ul>
                        <li>+91 9876543201</li>
                        <li>support@arfood.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'>Copyright 2026 © AR_Food. All rights reserved.</p>
        </div>
    )
}

export default Footer