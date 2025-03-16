import { Document, Types } from "mongoose";
import Contest from "../model/model"


export const getPastContest = async(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; data?: (Document<unknown, {}, { createdAt: NativeDate; updatedAt: NativeDate; } & { id: number; host: string; event: string; start: string; duration: number; url?: string | null | undefined; }> & { createdAt: NativeDate; updatedAt: NativeDate; } & { id: number; host: string; event: string; start: string; duration: number; url?: string | null | undefined; } & { _id: Types.ObjectId; } & { __v: number; })[]; }): any; new(): any; }; }; }) =>{
    try {
        const response = await Contest.find({});
        if(!response){
            return res.status(401).json({message:"No Contest Found"});
        }
        return res.status(200).json({message:"Contest Found", data:response});
    } catch (error) {
        console.log((error as Error).message);
    }
}