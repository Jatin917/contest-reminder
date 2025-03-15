import mongoose from "mongoose"

export const Connection = async(url:string) =>{
    try {
        await mongoose.connect(url);
        console.log("Connected Successfully");
    } catch (error) {
        console.log("Error in Connection");
    }
}