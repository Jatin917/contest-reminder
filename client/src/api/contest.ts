import axios from 'axios'
const url = "https://clist.by:443/api/v4/contest";

export interface functionTypes {
    host:string
}

const getUpcomingContest = async({host} : functionTypes) =>{
    try {
        const repsonse = await axios.get(url+`/?upcoming=true&host=${host}.com`);
        if(!repsonse) return {status:400, message:"didn't got data"};
        return {status:200, data:repsonse.data}
    } catch (error) {
        return {status:501, message:(error as Error).message}
    }
}

export const getAllUpcomingContest = async (h1:functionTypes,h2:functionTypes,h3:functionTypes) =>{
    try {
        const results = [];
        if(h1){
            const h1Response = await getUpcomingContest(h1);
            if(h1Response && h1Response.data){
                results.push(h1Response.data);
            }
        }
        if(h2){
            const h2Response = await getUpcomingContest(h1);
            if(h2Response && h2Response.data){
                results.push(h2Response.data);
            }
        }
        if(h3){
            const h3Response = await getUpcomingContest(h1);
            if(h3Response && h3Response.data){
                results.push(h3Response.data);
            }
        }
        return {status:200, data:results};
    } catch (error) {
        return {status:501, message:(error as Error).message};
    }
}