import axios from 'axios'

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

let lastVideoId: (null|Number) = null;  // Stores last checked video ID

// Function to fetch the latest video
export async function checkNewVideo() {
    try {
        // 1️⃣ Get Uploads Playlist ID
        const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
            params: {
                part: 'snippet',
                playlistId:'UUqL-fzHtN3NQPbYqGymMbTA',
                maxResults:1,
                publishedAfter:'',
                id: CHANNEL_ID,
                key: API_KEY,
            },
        });

        const videoId = channelResponse.snippet.resourceId.videoId;
        const title = channelResponse.items[0].snippet.title;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // 3️⃣ Check if it's a new video
        if (videoId !== lastVideoId) {
            console.log(`🎉 New video uploaded!`);
            console.log(`📌 Title: ${title}`);
            console.log(`🔗 Link: ${videoUrl}`);
            
            // Update last checked video ID
            lastVideoId = videoId;
        } else {
            console.log(`🔄 No new video uploaded.`);
        }
    } catch (error) {
        console.error('❌ Error fetching video:', error.response?.data || error.message);
    }
}

