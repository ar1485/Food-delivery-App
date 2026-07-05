import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing User Order
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173"; 
    
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false, 
            status: "Food Processing", 
            date: Date.now() 
        });
    
        await newOrder.save();

        if (req.body.paymentMethod === "COD") {
            await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
            return res.json({ success: true, message: "Order placed via COD!", isCOD: true });
        }

        const session_url = `${frontend_url}/verify?success=true&orderId=${newOrder._id}`;
        return res.json({ success: true, session_url: session_url });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error placing order" });
    }
};

// Verifying Order
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true" || success === true) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            const order = await orderModel.findById(orderId);
            if (order) {
                await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
                return res.json({ success: true, message: "Paid successfully" });
            }
            return res.json({ success: false, message: "Order not found" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Verification Error" });
    }
};

// Admin Panel: List all orders for Admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    const { orderId, status } = req.body;
    try {
        await orderModel.findByIdAndUpdate(orderId, { status: status });
        return res.json({ success: true, message: "Order status updated!" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error updating status" });
    }
};

// Fetch User Orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

// Cancel Order
const cancelOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        await orderModel.findByIdAndDelete(orderId);
        res.json({ success: true, message: "Order cancelled" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error cancelling order" });
    }
};

export { placeOrder, verifyOrder, listOrders, updateStatus, userOrders, cancelOrder };