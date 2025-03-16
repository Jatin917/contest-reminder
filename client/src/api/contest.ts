import axios from 'axios'
const url = "https://clist.by:443/api/v4/contest";

export interface functionTypes {
    host:string
}

const getUpcomingContest = async({host} : functionTypes) =>{
    try {
        const repsonse = await axios.get(url+`/?upcoming=true&host=${host}.com`, 
            {
                headers:{
                    Authorization: 'ApiKey Jatin917:92898c1c7cbe6d17f44543e95c4a820ed702f990'
                }
            }
        );
        if(!repsonse) return {status:400, message:"didn't got data"};
        return {status:200, data:repsonse.data.objects}
    } catch (error) {
        return {status:501, message:(error as Error).message}
    }
}

export const getAllUpcomingContest = async (host:{host1:string, host2:string, host3:string}) =>{
    try {
        const results = [];
        if(host.host1){
            const h1Response = await getUpcomingContest({host:host.host1});
            if(h1Response && h1Response.data){
                const arr = h1Response.data;
                arr.forEach((contest: unknown) => {
                    results.push(contest);
                });
            }
        }
        if(host.host2){
            const h2Response = await getUpcomingContest({host:host.host2});
            if(h2Response && h2Response.data){
                const arr = h2Response.data;
                arr.forEach((contest: unknown) => {
                    results.push(contest);
                });
            }
        }
        if(host.host3){
            const h3Response = await getUpcomingContest({host:host.host3});
            if(h3Response && h3Response.data){
                const arr = h3Response.data;
                arr.forEach((contest: unknown) => {
                    results.push(contest);
                });
            }
        }
        return {status:200, data:results};
    } catch (error) {
        return {status:501, message:(error as Error).message};
    }
}
const getPastContest = async({host} : functionTypes) =>{
    try {
        const now = new Date().toISOString().slice(0, 19);
        const repsonse = await axios.get('http://localhost:3000/api/pastcontest');
        if(!repsonse) return {status:400, message:"didn't got data"};
        return {status:200, data:repsonse.data.objects}
    } catch (error) {
        return {status:501, message:(error as Error).message}
    }
}

export const getAllPastContest = async (host:{host1:string, host2:string, host3:string}) =>{
    try {
        const results = [];
        if(host.host1){
            const h1Response = await getPastContest({host:host.host1});
            if(h1Response && h1Response.data){
                const arr = h1Response.data;
                arr.forEach((contest: unknown) => {
                    results.push(contest);
                });
            }
        }
        if(host.host2){
            const h2Response = await getPastContest({host:host.host2});
            if(h2Response && h2Response.data){
                const arr = h2Response.data;
                arr.forEach((contest: unknown) => {
                    results.push(contest);
                });
            }
        }
        if(host.host3){
            const h3Response = await getPastContest({host:host.host3});
            if(h3Response && h3Response.data){
                const arr = h3Response.data;
                arr.forEach((contest: unknown) => {
                    results.push(contest);
                });
            }
        }
        return {status:200, data:results};
    } catch (error) {
        return {status:501, message:(error as Error).message};
    }
}