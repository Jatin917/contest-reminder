# Contest Reminder - MERN Stack (TypeScript)

## 🚀 Overview
**Contest Reminder** is a full-stack web application built with the **MERN stack (MongoDB, Express.js, React.js, Node.js) and TypeScript**.  
It helps users **track upcoming and past coding contests** from **Codeforces, CodeChef, and Leetcode** while providing an automated system to **attach YouTube solution links**.

## 🌟 Features
✅ Fetch **upcoming contests** from Codeforces, CodeChef, and Leetcode  
✅ Show **contest date and countdown timer** before it starts  
✅ Display **past contests** with **solution links**  
✅ **Filter contests** by platform (Codeforces, CodeChef, Leetcode)  
✅ **Bookmark** contests for future reference  
✅ **Manually attach** solution links via a form  
✅ **Auto-fetch YouTube solutions** using Google API  
✅ Built with **TypeScript** for better type safety  

---

## 🎥 Video Demonstrations
📌 **Automatically Attaching YouTube Links** – [Watch Video](#)  
📌 **UI and Features Overview** – [Watch Video](#)  

---

## 🛠 Tech Stack

### **Frontend:**
- React.js (**TypeScript**)  
- Vite  
- Tailwind CSS  

### **Backend:**
- Node.js  
- Express.js (**TypeScript**)  

### **Database:**
- MongoDB  

### **API Integration:**
- **Google Developer Console (YouTube API)**  
- **Clist.by API** (for contest data)  

### **State Management:**
- React Context API  

---

## 🔍 How It Works

### **Fetching Contests**
- **Upcoming Contests**: Directly fetched **on the frontend** via Clist.by API.  
- **Past Contests**:  
  - Fetched in the **backend** using a **polling mechanism**.  
  - If a contest already exists in the database, it **won’t be added again**.  
  - The frontend fetches past contests **from the backend**.

### **YouTube Integration**
- The **backend polls the YouTube API every minute** to check for **new uploads**.  
- If a **new video is detected**, its **title is checked** against past contests in the database.  
- If a **matching contest is found**, the **solution link is automatically attached**.

---

## 🔧 Installation and Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/jatin917/contest-reminder.git
cd contest-reminder


.env for server
DATABASE_URL=
YOUTUBE_API_KEY=

CODECHEF_PLAYLIST_ID=
LEETCODE_PLAYLIST_ID=
CODEFORCES_PLAYLIST_ID=
CLISTAPI=

.env for client
VITE_API_BASE_URL=

install dependencies in respective folder
npm install
and run in local
npm run dev

