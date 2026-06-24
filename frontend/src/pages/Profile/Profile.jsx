import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const { token, setToken, setCartItems, addressesList, removeAddress, url, food_list, favorites, toggleFavorite } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const [activeTab, setActiveTab] = useState('account');
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        firstName: 'Amrit',
        lastName: 'Raj',
        phone: '8210305021'
    });

    const [ordersData, setOrdersData] = useState([]);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // --- Settings State ---
    const [userSettings, setUserSettings] = useState({
        theme: 'light',
        language: 'English',
        notifications: {
            orderStatus: true,
            promotions: false,
            push: true,
            email: false,
            sms: true
        },
        dietary: 'Any',
        allergies: ''
    });

    const handleToggle = (key) => {
        setUserSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
        navigate("/");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        alert("✅ Profile Updated Successfully!");
        setIsEditing(false);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
                if (response.data.success) {
                    setOrdersData(response.data.data.reverse());
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        if (token && activeTab === 'orders') {
            fetchOrders();
        }
    }, [token, activeTab, url]);

    const openTrackingModal = (order) => {
        setSelectedOrder(order);
        setShowTrackModal(true);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'account': return (
                <div className="dashboard-tab-panel-view modern-card-panel">
                    <div className="tab-header">
                        <h2>Personal Details</h2>
                        {!isEditing && (
                            <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                                ✎ Edit Profile
                            </button>
                        )}
                    </div>

                    <form className="dashboard-edit-profile-form" onSubmit={handleProfileSubmit}>
                        <div className="form-double-fields-split">
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" name="firstName" value={userData.firstName} onChange={handleInputChange} disabled={!isEditing} required className={isEditing ? 'input-editing' : ''} />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" name="lastName" value={userData.lastName} onChange={handleInputChange} disabled={!isEditing} required className={isEditing ? 'input-editing' : ''} />
                            </div>
                        </div>
                        <div className="form-group mb-20">
                            <label>Email Address</label>
                            <input type="email" value="raj@gmail.com" disabled className="input-disabled" />
                        </div>
                        <div className="form-group mb-30">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={userData.phone} onChange={handleInputChange} disabled={!isEditing} required pattern="[0-9]{10}" title="Enter a valid 10 digit phone number" className={isEditing ? 'input-editing' : ''} />
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <button type="submit" className="btn-save-changes">Save Changes</button>
                                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        )}
                    </form>
                </div>
            );

            case 'orders': return (
                <div className="dashboard-tab-panel-view modern-card-panel bg-light-gray">
                    <h2 className="section-title">Order History</h2>

                    {ordersData.length === 0 ? (
                        <div className="empty-state-box">
                            <div className="empty-icon">🍽️</div>
                            <h3>No orders yet!</h3>
                            <p>Looks like you haven't placed any orders. Delicious food is waiting for you.</p>
                        </div>
                    ) : (
                        <div className="orders-list-container">
                            {ordersData.map((order, index) => (
                                <div key={index} className="order-card">
                                    <div className="order-card-header">
                                        <div>
                                            <p className="order-id">Order ID: #{order._id.substring(0, 8)}...</p>
                                            <p className="order-items-summary">
                                                {order.items.map((item, idx) => {
                                                    return idx === order.items.length - 1 ? `${item.name} x ${item.quantity}` : `${item.name} x ${item.quantity}, `
                                                })}
                                            </p>
                                        </div>
                                        <div className={`order-status-badge ${order.status === 'Delivered' ? 'status-delivered' : 'status-processing'}`}>
                                            {order.status || 'Processing'}
                                        </div>
                                    </div>

                                    <div className="order-card-footer">
                                        <div className="order-price-details">
                                            <div>
                                                <p className="detail-label">Total Amount</p>
                                                <p className="detail-value">${order.amount}.00</p>
                                            </div>
                                            <div>
                                                <p className="detail-label">Items</p>
                                                <p className="detail-value">{order.items.length}</p>
                                            </div>
                                        </div>
                                        <div className="order-action-buttons">
                                            <button className="btn-track" onClick={() => openTrackingModal(order)}>Track Order</button>
                                            <button className="btn-reorder" onClick={() => alert("Adding items back to cart...")}>Reorder</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );

            case 'payment': return (
                <div className="dashboard-tab-panel-view modern-card-panel">
                    <h2 className="section-title">Payment Methods</h2>

                    <div className="mb-30">
                        <h4 className="subsection-title">Linked Wallets & UPI</h4>
                        <div className="payment-grid">
                            {['Google Pay', 'PhonePe', 'Amazon Pay'].map((wallet, index) => (
                                <div key={index} className="payment-wallet-card">
                                    <div className="wallet-info">
                                        <div className="wallet-icon">💳</div>
                                        <h4>{wallet}</h4>
                                    </div>
                                    <span className="link-text">Link</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="subsection-title">Saved Cards</h4>
                        <div className="add-card-box" onClick={() => alert("Add Card Gateway...")}>
                            <div className="add-card-content">
                                <span className="add-icon">+</span>
                                <p>Add New Credit/Debit Card</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

            case 'addresses': return (
                <div className="dashboard-tab-panel-view addresses-panel">
                    <div className="addresses-header">
                        <span className="back-arrow" onClick={() => setActiveTab('account')}>←</span>
                        <h2>Addresses</h2>
                    </div>

                    <div className="addresses-subheader">
                        Saved Addresses
                    </div>

                    <div className="addresses-content">
                        {addressesList && addressesList.length === 0 ? (
                            <p className="empty-text">No saved addresses found. Please add a new one.</p>
                        ) : (
                            addressesList && addressesList.map((addr) => (
                                <div key={addr.id} className="address-item-row">
                                    <div className="address-icon-large">
                                        {addr.icon || '🏠'}
                                    </div>
                                    <div className="address-details-col">
                                        <h4>{addr.type || 'Home'}</h4>
                                        <p>{addr.line1}, {addr.cityState}</p>
                                        <p className="phone-text">Phone number: <span>{addr.phone}</span></p>

                                        <div className="address-action-links">
                                            <button onClick={() => alert("Edit Modal Opening...")}>EDIT</button>
                                            <button onClick={() => removeAddress(addr.id)}>DELETE</button>
                                            <button onClick={() => alert("Sharing Address...")}>SHARE</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="mt-30">
                            <button className="btn-add-address" onClick={() => alert("Open Add New Address Gateway...")}>
                                ADD NEW ADDRESS
                            </button>
                        </div>
                    </div>
                </div>
            );

            case 'favorites': return (
                <div className="dashboard-tab-panel-view modern-card-panel">
                    <h2 className="section-title">Favorite Food</h2>
                    <div className="favorites-grid">
                        {food_list && favorites && food_list.filter((item) => favorites[item._id]).length === 0 ? (
                            <p>No favorites added yet!</p>
                        ) : (
                            food_list && favorites && food_list.filter((item) => favorites[item._id]).map((item) => (
                                <div key={item._id} className="favorite-item-card">
                                    <img src={url + "/images/" + item.image} alt={item.name} />
                                    <h4>{item.name}</h4>
                                    <p>${item.price}</p>
                                    <button className='remove-fav-btn' onClick={() => toggleFavorite(item._id)}> Remove X</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            );

            case 'settings': return (
                <div className="dashboard-tab-panel-view bg-light-gray" style={{ padding: '30px', borderRadius: '16px', minHeight: '100%' }}>
                    <h2 className="section-title">Settings</h2>

                    {/* Appearance & Language Section */}
                    <div className="settings-section">
                        <h4 className="subsection-title">App Preferences</h4>
                        <div className="settings-card">
                            <div className="setting-row">
                                <div className="setting-text">
                                    <h4>Appearance</h4>
                                    <p>Choose your preferred theme</p>
                                </div>
                                <select className="settings-select" value={userSettings.theme} onChange={(e) => setUserSettings({...userSettings, theme: e.target.value})}>
                                    <option value="light">Light Mode</option>
                                    <option value="dark">Dark Mode</option>
                                    <option value="system">System Default</option>
                                </select>
                            </div>
                            <div className="dashed-divider"></div>
                            <div className="setting-row">
                                <div className="setting-text">
                                    <h4>Language</h4>
                                    <p>Select your primary language</p>
                                </div>
                                <select className="settings-select" value={userSettings.language} onChange={(e) => setUserSettings({...userSettings, language: e.target.value})}>
                                    <option value="English">English</option>
                                    <option value="हिंदी">हिंदी</option>
                                    <option value="தமிழ்">தமிழ்</option>
                                    <option value="ಕನ್ನಡ">ಕನ್ನಡ</option>
                                    <option value="മലയാളം">മലയാളം</option>
                                    <option value="తెలుగు">తెలుగు</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="settings-section mt-30">
                        <h4 className="subsection-title">Notifications</h4>
                        <div className="settings-card">
                            {/* Order Status */}
                            <div className="setting-row">
                                <div className="setting-text">
                                    <h4>Order Status</h4>
                                    <p>Live updates on your food delivery</p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={userSettings.notifications.orderStatus} onChange={() => handleToggle('orderStatus')} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="dashed-divider"></div>
                            {/* Promotions */}
                            <div className="setting-row">
                                <div className="setting-text">
                                    <h4>Promotions & Offers</h4>
                                    <p>Get notified about discounts and coupons</p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={userSettings.notifications.promotions} onChange={() => handleToggle('promotions')} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="dashed-divider"></div>
                            {/* SMS, Email, Push */}
                            <div className="setting-row">
                                <div className="setting-text">
                                    <h4>Push Notifications</h4>
                                    <p>Receive alerts on your device</p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={userSettings.notifications.push} onChange={() => handleToggle('push')} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="dashed-divider"></div>
                            <div className="setting-row">
                                <div className="setting-text">
                                    <h4>SMS Alerts</h4>
                                    <p>Important delivery alerts via SMS</p>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={userSettings.notifications.sms} onChange={() => handleToggle('sms')} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Food Preferences Section */}
                    <div className="settings-section mt-30">
                        <h4 className="subsection-title">Food Preferences</h4>
                        <div className="settings-card">
                            <div className="setting-row">
                                <div className="setting-text">
                                    <h4>Dietary Preference</h4>
                                    <p>Tailor your restaurant recommendations</p>
                                </div>
                                <select className="settings-select" value={userSettings.dietary} onChange={(e) => setUserSettings({...userSettings, dietary: e.target.value})}>
                                    <option value="Any">No Preference</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                </select>
                            </div>
                            <div className="dashed-divider"></div>
                            <div className="setting-row" style={{ alignItems: 'flex-start' }}>
                                <div className="setting-text" style={{ width: '100%' }}>
                                    <h4>Allergies</h4>
                                    <p>List any food allergies (e.g., Peanuts, Dairy)</p>
                                    <input type="text" className="settings-input" placeholder="Type allergies here..." value={userSettings.allergies} onChange={(e) => setUserSettings({...userSettings, allergies: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
            
            case 'help': return <div className="dashboard-tab-panel-view modern-card-panel"><h2>Help & Support</h2><p>Contact 24/7 Support...</p></div>;
            default: return <div className="dashboard-tab-panel-view modern-card-panel"><h2>Welcome Back!</h2></div>;
        }
    };

    return (
        <div className='profile-page-main-box'>

            <div className="profile-dashboard-sidebar">
                <div className="profile-avatar-card">
                    <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="Avatar" />
                    <h3>{userData.firstName} {userData.lastName}</h3>
                    <p>raj@gmail.com</p>
                </div>

                <div className="profile-dashboard-menu">
                    <div onClick={() => setActiveTab('account')} className={`profile-menu-item-row ${activeTab === 'account' ? 'active-tab-highlight' : ''}`}>👤 Personal Info</div>
                    <div onClick={() => setActiveTab('orders')} className={`profile-menu-item-row ${activeTab === 'orders' ? 'active-tab-highlight' : ''}`}>📦 Past Orders</div>
                    <div onClick={() => setActiveTab('payment')} className={`profile-menu-item-row ${activeTab === 'payment' ? 'active-tab-highlight' : ''}`}>💳 Payments</div>
                    <div onClick={() => setActiveTab('addresses')} className={`profile-menu-item-row ${activeTab === 'addresses' ? 'active-tab-highlight' : ''}`}>📍 Saved Addresses</div>
                    <div onClick={() => setActiveTab('favorites')} className={`profile-menu-item-row ${activeTab === 'favorites' ? 'active-tab-highlight' : ''}`}>❤️ Favorites</div>
                    <div onClick={() => setActiveTab('settings')} className={`profile-menu-item-row ${activeTab === 'settings' ? 'active-tab-highlight' : ''}`}>⚙️ Settings</div>
                    <div onClick={() => setActiveTab('help')} className={`profile-menu-item-row ${activeTab === 'help' ? 'active-tab-highlight' : ''}`}>❓ Help & Support</div>
                    <div onClick={logout} className="profile-menu-item-row logout-btn">🚪 Logout</div>
                </div>
            </div>

            <div className="profile-dashboard-content-panel">
                {renderContent()}
            </div>

            {/* --- TRACKING MODAL POPUP --- */}
            {showTrackModal && selectedOrder && (
                <div className="tracking-modal-overlay" onClick={() => setShowTrackModal(false)}>
                    <div className="tracking-modal-content" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-header">
                            <div>
                                <h3>ORDER #{selectedOrder._id.substring(0, 8).toUpperCase()}</h3>
                                <p>{selectedOrder.items.length} Items • ${selectedOrder.amount}</p>
                            </div>
                            <button className="close-modal-btn" onClick={() => setShowTrackModal(false)}>✕</button>
                        </div>

                        <div className="tracking-timeline">
                            <div className="timeline-line"></div>

                            <div className="timeline-node">
                                <div className="timeline-dot active"></div>
                                <div className="timeline-text">
                                    <h4>Tomato Kitchen</h4>
                                    <p>Order Accepted & Being Prepared.</p>
                                </div>
                            </div>

                            <div className="timeline-node">
                                <div className={`timeline-dot ${selectedOrder.status === 'Out For Delivery' || selectedOrder.status === 'Delivered' ? 'active' : ''}`}></div>
                                <div className="timeline-text">
                                    <h4>Out For Delivery</h4>
                                    <p>Delivery partner is on the way.</p>
                                </div>
                            </div>

                            <div className="timeline-node">
                                <div className={`timeline-dot ${selectedOrder.status === 'Delivered' ? 'delivered' : ''}`}></div>
                                <div className="timeline-text">
                                    <h4>Home</h4>
                                    <p>{selectedOrder.address?.street || 'Address'}, {selectedOrder.address?.city || ''}</p>
                                    {selectedOrder.status === 'Delivered' && <span className="delivered-badge">DELIVERED</span>}
                                </div>
                            </div>
                        </div>

                        <div className="bill-details-box">
                            <h4>Bill Details</h4>
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="bill-item-row">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div className="dashed-divider"></div>
                            <div className="bill-total-row">
                                <span>Bill Total</span>
                                <span className="total-amount">${selectedOrder.amount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;