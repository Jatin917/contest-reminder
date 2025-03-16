# contest-reminder


Video_url=>https://www.loom.com/share/ab691853036e448cae9cb27306f094ae?sid=d62a051e-b01c-46d5-995c-49e7f601941e



Contest Reminder - MERN Stack Project (TypeScript)
Overview
Contest Reminder is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and TypeScript. It helps users track upcoming and past coding contests from Codeforces, CodeChef, and Leetcode.

It also provides an automated system to attach solution links from a YouTube channel and enables users to filter, bookmark, and manage contests easily.

Features
✅ Fetch upcoming contests from Codeforces, CodeChef, and Leetcode
✅ Show contest date and time remaining before the contest starts
✅ Display past contests with attached solution links
✅ Platform-based filtering to select contests from one or multiple platforms
✅ Bookmark contests for future reference
✅ Attach solution links manually via a form
✅ Auto-fetch YouTube solutions using Google API when a new video is uploaded
✅ Built with TypeScript for better type safety and maintainability

Video Demonstrations
🎥 Automatically Attaching YouTube Links - [Watch Video](https://www.loom.com/share/ab691853036e448cae9cb27306f094ae?sid=d62a051e-b01c-46d5-995c-49e7f601941e)
🎥 UI and Features Overview - [Watch Video](https://www.loom.com/share/a1f59e69162045e799d800ea3a9d7bd7)

Tech Stack
Frontend: React.js (TypeScript), Vite, Tailwind CSS
Backend: Node.js, Express.js (TypeScript)
Database: MongoDB
API Integration: Google Developer Console (YouTube API), Clist.by API
State Management: React Context API
How It Works
Fetching Contests
Upcoming Contests are fetched directly on the frontend via Clist.by API.
Past Contests are fetched in the backend using a polling mechanism. If a contest already exists in the database, it won't be added again.
YouTube Integration
The server polls the YouTube API every minute to check for new uploads.
If a new video is detected, its title is checked against past contests in the database.
If a matching contest is found, the solution link is automatically attached to that contest.
Installation and Setup
1️⃣ Clone the Repository
sh
Copy
Edit
git clone https://github.com/your-username/contest-reminder.git
cd contest-reminder
2️⃣ Set Up Environment Variables
Server (.env file in backend/)
makefile
Copy
Edit
DATABASE_URL=
YOUTUBE_API_KEY=

CODECHEF_PLAYLIST_ID=
LEETCODE_PLAYLIST_ID=
CODEFORCES_PLAYLIST_ID=
CLISTAPI=
Client (.env file in frontend/)
makefile
Copy
Edit
VITE_API_BASE_URL=
3️⃣ Install Dependencies
Run the following command in both frontend/ and backend/ folders:

sh
Copy
Edit
npm install
4️⃣ Start the Development Server
Run the backend:

sh
Copy
Edit
npm run dev
Run the frontend:

sh
Copy
Edit
npm run dev
Future Improvements
🔹 Add user authentication for personalized contest tracking
🔹 Implement notifications for upcoming contests
🔹 Optimize backend polling mechanism for better efficiency
