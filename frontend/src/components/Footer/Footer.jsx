import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt='' />
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse fuga velit perspiciatis, provident, molestiae ut fugit ab veniam tenetur facere delectus sequi nobis illo, dicta dolore suscipit deleniti molestias hic.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt='' />
                        <img src={assets.twitter_icon} alt='' />
                        <img src={assets.instagram_icon} alt='' />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Company</h2>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy</li>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+91 9876543201</li>
                        <li>support@fooddelivery.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'> copyright 2026 © Food Delivery. All rights reserved.</p>
        </div>
    )
}

export default Footer
