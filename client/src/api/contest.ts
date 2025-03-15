import axios from 'axios'
const url = "https://clist.by:443/api/v4/contest";

interface functionTypes {
    host:string
}

export const getUpcomingContest = async({host} : functionTypes) =>{
    try {
        const repsonse = await axios.get(url+`/?upcoming=true&host=${host}.com`);
        if(!repsonse) return {status:400, message:"didn't got data"};
        return {status:200, data:repsonse.data}
    } catch (error) {
        return {status:501, message:(error as Error).message}
    }
}