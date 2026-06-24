import userModel from "../models/userModel.js";

const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const updatedAddresses = user.addresses.filter(item => item.id !== addressId);

        await userModel.findByIdAndUpdate(userId, { addresses: updatedAddresses });
        
        res.json({ success: true, message: "Address deleted successfully from database" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting address at server layer" });
    }
};

export { deleteAddress };