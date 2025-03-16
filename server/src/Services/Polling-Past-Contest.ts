import Contest from "../model/model";
import axios from 'axios'

const url = "https://clist.by:443/api/v4/contest";

export const pollingPastContest = async(host:string) =>{
    try {
        const now = new Date().toISOString().slice(0, 19);
        const response = await axios.get(url+`/?host=${host}.com&end__lte=${now}&order_by=-end&limit=4`, 
            {
                headers:{
                    Authorization: 'ApiKey Jatin917:92898c1c7cbe6d17f44543e95c4a820ed702f990'
                }
            }
        );
        console.log("response of PollingContest", response);
        if(!response) return {status:400, message:"didn't got data"};
        return response.data;
    } catch (error) {
        console.log((error as Error).message);
    }
}

interface ContestType {
    id:number, 
    duration:number,
    start:string,
    event:string,
    host:string
  }
interface responseType {
    meta:object,
    objects:ContestType[]
}


export const checkingInDB = async () => {
    try {
        const platforms = ['leetcode', 'codechef', 'codeforces'];

        for (const platform of platforms) {
            let contestData = await pollingPastContest(platform);
            console.log("contestData ", contestData);
            const contests: ContestType[] = (contestData as responseType).objects;

            for (const contest of contests) {
                const existingContest = await Contest.findOne({ id: contest.id });
                let event = contest.event;
                if (!existingContest) {
                    const resp = await Contest.create({
                        event: event,
                        start: contest.start, // Include other fields as needed
                        duration: contest.duration,
                        host: platform,
                        id:contest.id
                    });
                    if(!resp){
                        console.log("No Contest Created");
                    }
                    else console.log(`Created contest: ${contest.event} on ${platform}`);
                } else {
                    console.log(`Contest "${contest.event}" already exists on ${platform}.`);
                }
            }
        }
    } catch (error) {
        console.error("Error checking contests in DB:", error);
    }
};
