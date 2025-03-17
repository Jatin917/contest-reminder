import axios from 'axios'
import Contest from '../model/model';
import dotenv from 'dotenv';
dotenv.config();
const PLAYLISTS = [
    { name: "CodeChef", id: process.env.CODECHEF_PLAYLIST_ID },
    { name: "Leetcode", id: process.env.LEETCODE_PLAYLIST_ID},
    { name: "CodeForces", id: process.env.CODEFORCES_PLAYLIST_ID }
];

const API_KEY = process.env.YOUTUBE_API_KEY;

// Function to fetch the latest video

async function attachLinkToDB(url: string, title: string) {
    try {
        // Normalize the title
        let normalizedTitle = title
            .replace(/^Leetcode\s+/i, '')   // Remove "Leetcode" at the start
            .replace(/\bDiv\.?\s?(\d+)\b/g, 'Div. $1')  // Convert "Div", "DivX", "Div. X" → "Div. X"
            .trim();

        // MongoDB regex to match with or without "Leetcode" and optional "Unrated"
        const regexPattern = `^(Leetcode\\s+)?${normalizedTitle.replace(/\./g, '\\.').replace(/\(Div\\.? (\d+)\)/g, '\\(Div\\.? $1\\)')}(,? Unrated| \\(Rated till 5 star\\))?$`;
        console.log("title is ", title, regexPattern)

        // Find and update the contest event
        const response = await Contest.findOneAndUpdate(
            { event: { $regex: regexPattern, $options: "i" } }, 
            { $set: { url: url } }, 
            { new: true } 
        );

        if (!response) {
            console.log("No matching contest found to add the link.");
            return { status: 404, message: "No matching contest found." };
        }
        
        console.log("Link added successfully:");
        return { status: 201, message: "Added Link" };
        
    } catch (error) {
        console.error("Error updating link:", (error as Error).message);
        return { status: 500, message: "Internal Server Error" };
    }
}

let lastVideoIds= {CodeChef:'', Leetcode:'', CodeForces:''};  // Stores last checked video ID
export async function checkNewVideos() {
    try {
        for (const platform of PLAYLISTS) {
            const { name, id } = platform;
            
            // Fetch latest video from the playlist
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
                params: {
                    part: "snippet",
                    playlistId: id,
                    maxResults: 1,
                    key: API_KEY
                },
            });

            if (response.data.items.length === 0) {
                console.log(`No videos found in ${name} playlist.`);
                continue;
            }

            // Extract video details
            const latestVideo = response.data.items[0];
            const videoId = latestVideo.snippet.resourceId.videoId;
            const title = latestVideo.snippet.title;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // Check if it's a new video for this platform
            if (lastVideoIds[name] !== videoId) {
                await attachLinkToDB(videoUrl, title.split("|")[0]);
                console.log(`📌 [${name}] Title: ${title}`);
                console.log(`🔗 Link: ${videoUrl}`);
                lastVideoIds[name] = videoId; // Update last video ID for this platform
            } else {
                console.log(`🔄 [${name}] No new video uploaded.`);
            }
        }
    } catch (error) {
        console.error("❌ Error fetching video:", error.response?.data || error.message);
    }
}