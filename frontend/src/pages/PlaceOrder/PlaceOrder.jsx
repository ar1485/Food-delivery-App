import { useContext, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlaceOrder.css';

const PlaceOrder = () => {
    const { getTotalCartAmount, token, url, cartItems, food_list, setCartItems, saveAddress, addressesList } = useContext(StoreContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [isAddressSelected, setIsAddressSelected] = useState(false);

    const [data, setData] = useState({
        firstName: "", lastName: "", email: "",
        street: "", city: "", state: "",
        zipcode: "", country: "", phone: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (isAddressSelected) setIsAddressSelected(false);
    };

    const selectSavedAddress = (addr) => {
        const nameParts = addr.name.split(' ');
        setData({
            firstName: nameParts[0] || "",
            lastName: nameParts[1] || "",
            email: data.email || "",
            street: addr.line1 || "",
            city: addr.cityState.split(',')[0] || "",
            state: addr.cityState.split(',')[1]?.split('-')[0]?.trim() || "",
            zipcode: addr.cityState.split('-')[1]?.trim() || "",
            country: "India",
            phone: addr.phone ? addr.phone.replace("📞 Phone: ", "") : ""
        });
        setIsAddressSelected(true);
    };

    const placeOrderHandler = async (event) => {
        event.preventDefault();
        
        const newSavedAddress = {
            type: "Recent Delivery", icon: "📌",
            name: `${data.firstName} ${data.lastName}`,
            line1: data.street,
            cityState: `${data.city}, ${data.state} - ${data.zipcode}`,
            phone: data.phone
        };

        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo);
            }
        });

        let orderData = { address: data, items: orderItems, amount: getTotalCartAmount() + 2, paymentMethod };

        try {
            let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
            
            if (response.data.success) {
                setCartItems({});
                if (saveAddress) saveAddress(newSavedAddress);
                
                if (paymentMethod === 'COD') {
                    alert("🎉 Order Placed!");
                    navigate('/profile');
                } else {
                    const { session_url } = response.data;
                    if (session_url && session_url.startsWith('http')) {
                        window.location.replace(session_url);
                    } else {
                        alert("Error: Invalid Payment URL received.");
                    }
                }
            } else {
                alert(response.data.message || "Order failed.");
            }
        } catch (error) {
            console.error(error);
            alert("Error placing order! Check your server connection.");
        }
    };

    return (
        <form onSubmit={placeOrderHandler} className='place-order'>
            <div className="place-order-left">
                {addressesList.length > 0 && (
                    <div className="saved-addresses-selector">
                        <h3>Select Saved Address</h3>
                        <div className="address-options-grid">
                            {addressesList.map((addr) => (
                                <div key={addr.id} className="addr-option-card" onClick={() => selectSavedAddress(addr)}>
                                    <h4>{addr.icon} {addr.type}</h4>
                                    <p>{addr.line1.substring(0, 20)}...</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <p className="title">Delivery Information</p>
                {isAddressSelected && (
                    <button type="button" onClick={() => setIsAddressSelected(false)} className="edit-addr-btn">
                        Edit / Change Address
                    </button>
                )}

                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-fields">
                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div className="cart-total-details"><p>Subtotal</p><p>${getTotalCartAmount()}</p></div>
                    <hr />
                    <div className="cart-total-details"><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? 0 : 2}</p></div>
                    <hr />
                    <div className="cart-total-details"><b>Total</b><b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b></div>
                    
                    <div className="payment-method-selection">
                        <h3>Select Payment Method</h3>
                        <div className="payment-option" onClick={() => setPaymentMethod('Online')}>
                            <input type="radio" name="payment" checked={paymentMethod === 'Online'} readOnly />
                            <label>💳 Online Payment</label>
                        </div>
                        <div className="payment-option" onClick={() => setPaymentMethod('COD')}>
                            <input type="radio" name="payment" checked={paymentMethod === 'COD'} readOnly />
                            <label>💵 Cash on Delivery (COD)</label>
                        </div>
                    </div>
                    <button type='submit'>{paymentMethod === 'COD' ? "PLACE COD ORDER" : "PROCEED TO PAYMENT"}</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;