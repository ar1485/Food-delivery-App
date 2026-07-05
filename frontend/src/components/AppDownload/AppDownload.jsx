import { assets } from '../../assets/assets'
import './AppDownload.css'

const AppDownload = () => {
    return (
        <div className='app-download-wrapper' id='app-download'>
            <div className='app-download-card'>
                <h2>Get the AR_Food App</h2>
                <p>For the best experience, lightning-fast delivery, and exclusive offers, download our mobile app today.</p>
                <div className="app-download-platforms">
                    <img src={assets.play_store} alt="Get it on Google Play" className="store-btn" />
                    <img src={assets.app_store} alt="Download on the App Store" className="store-btn" />
                </div>
            </div>
        </div>
    )
}

export default AppDownload