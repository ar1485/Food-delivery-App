import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import './MyOrders.css';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
        }
    };
    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                const response = await axios.post(`${url}/api/order/cancel`, { orderId }, { headers: { token } });
                if (response.data.success) {
                    alert("🗑️ Order cancelled successfully!");
                    fetchOrders();
                } else {
                    alert("Failed to cancel order");
                }
            } catch (error) {
                console.error("Error cancelling order:", error);
                alert("Network error while cancelling order");
            }
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders History</h2>
            <div className="container">
                {data.length === 0 ? (
                    <p className="no-orders">You haven't placed any orders yet.</p>
                ) : (
                    data.map((order, index) => {
                        return (
                            <div key={index} className='my-orders-order'>
                                <img src={assets.parcel_icon || "https://cdn-icons-png.flaticon.com/512/754/754290.png"} alt="Parcel Icon" />
                                <p>
                                    {order.items.map((item, idx) => {
                                        if (idx === order.items.length - 1) {
                                            return item.name + " x " + item.quantity;
                                        } else {
                                            return item.name + " x " + item.quantity + ", ";
                                        }
                                    })}
                                </p>
                                <p>${order.amount}.00</p>
                                <p>Items: {order.items.length}</p>
                                <p>
                                    <span className="status-bullet">●</span> 
                                    <b>{order.status}</b>
                                </p>
                                <div className="order-actions-vertical">
                                    <button onClick={fetchOrders} className="track-btn">Track Order</button>
                                    <button onClick={() => handleCancelOrder(order._id)} className="cancel-btn">Cancel Order</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyOrders;