import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets'; 
import './Orders.css';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                setOrders(response.data.data.reverse());
            } else {
                toast.error("Failed to load orders");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Network error: Check if backend is running on port 4000");
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(`${url}/api/order/status`, {
                orderId,
                status: event.target.value
            });
            if (response.data.success) {
                toast.success("Status updated!");
                await fetchAllOrders(); 
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='order add'>
            <h3>Orders Management Panel</h3>
            <div className="order-list">
                {orders.length === 0 ? (
                    <div className="no-orders-msg">No orders placed yet.</div>
                ) : (
                    orders.map((order, index) => (
                        <div key={index} className='order-item'>
                            <img src={assets.parcel_icon} alt="Parcel" />
                            <div>
                                <p className='order-item-food'>
                                    {order.items.map((item, idx) => 
                                        `${item.name} x ${item.quantity}${idx === order.items.length - 1 ? "" : ", "}`
                                    )}
                                </p>
                                <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                                <div className='order-item-address'>
                                    <p>{order.address.street + ","}</p>
                                    <p>{`${order.address.city}, ${order.address.state}, ${order.address.zipcode}`}</p>
                                </div>
                                <p className='order-item-phone'>{order.address.phone}</p>
                            </div>
                            <p>Items: {order.items.length}</p>
                            <p className="order-price">${order.amount}.00</p>
                            <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                                <option value="Food Processing">Food Processing</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;