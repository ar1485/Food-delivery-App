import mongoose from "mongoose";
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://amritraj:8210305021@cluster0.yafzww3.mongodb.net/food-delivery').then(()=>console.log("DB connected"));


}