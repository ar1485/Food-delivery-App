import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    
    // 🔴 NAYA STATE: User ka role (user ya admin) track karne ke liye
    const [role, setRole] = useState(""); 
    
    const [food_list, setFoodList] = useState([]);
    const [favorites, setFavorites] = useState(() => {
        const savedFavs = localStorage.getItem("user_favorites");
        return savedFavs ? JSON.parse(savedFavs) : {};
    });

    const [addressesList, setAddressesList] = useState(() => {
        const savedData = localStorage.getItem("user_addresses");
        return savedData ? JSON.parse(savedData) : [];
    });

    const saveAddress = (newAddress) => {
        setAddressesList((prev) => {
            const isDuplicate = prev.some(addr => addr.line1 === newAddress.line1);
            
            if (isDuplicate) {
                console.log("Address already exists, skipping duplicate.");
                return prev; 
            }

            const addressWithId = { ...newAddress, id: "addr_" + Date.now() };
            const updated = [...prev, addressWithId];
            localStorage.setItem("user_addresses", JSON.stringify(updated));
            return updated;
        });
    };

    
    const removeAddress = (addressId) => {
        setAddressesList((prev) => {
            const updated = prev.filter(addr => addr.id !== addressId);
            localStorage.setItem("user_addresses", JSON.stringify(updated));
            return updated;
        });
    };

    const toggleFavorite = (itemId) => {
        setFavorites((prev) => {
            const updated = { ...prev, [itemId]: !prev[itemId] };
            localStorage.setItem("user_favorites", JSON.stringify(updated));
            return updated;
        });
    };

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[itemId] > 1) {
                updatedCart[itemId] -= 1;
            } else {
                delete updatedCart[itemId]; 
            }
            return updatedCart;
        });
        
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const loadCartData = async (tokenKey) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: tokenKey } });
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            setCartItems({});
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const localToken = localStorage.getItem("token");
            
            
            const localRole = localStorage.getItem("role"); 
            
            if (localToken) {
                setToken(localToken);
                setRole(localRole || "user");
                await loadCartData(localToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        addressesList, 
        saveAddress,   
        removeAddress,
        favorites,
        toggleFavorite,
        role,
        setRole
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );

};

export default StoreContextProvider;