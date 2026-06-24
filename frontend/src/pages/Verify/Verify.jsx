import { useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import './Verify.css'; 

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const { url, token, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            const response = await axios.post(`${url}/api/order/verify`, { success, orderId }, { headers: { token } });
            if (response.data.success) {
                setCartItems({}); 
                alert("🎉 Payment Success! Your order has been securely placed.");
                navigate("/myorders");
            } else {
                alert("❌ Transaction failed or cancelled.");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            alert("Error in background verification query.");
            navigate("/");
        }
    };

    useEffect(() => {
        if (token) {
            verifyPayment();
        }
    }, [token]);

    return (
        <div className='verify'>
            <div className="spinner"></div>
            <p>Securing connection with verification server, please wait...</p>
        </div>
    );
};

export default Verify;