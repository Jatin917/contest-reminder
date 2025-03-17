import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Connection } from './db/db';
import { attachSolution } from './Controller/addLink';
import { checkNewVideos } from './Services/Polling-New-Video';
import { checkingInDB } from './Services/Polling-Past-Contest';
import { getPastContest } from './Controller/getPastContest';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Ensure JSON parsing middleware is included

const port = 3000;
const url = process.env.DATABASE_URL || '';



// ✅ Use `express.Router()` instead of `app.router()`
const router = express.Router(); 

router.post('/attachSolution', attachSolution);
router.get('/pastcontest', getPastContest);

// ✅ Mount the router in the app
app.use('/api', router);

app.listen(port, () => {
    console.log('Server running on port:', port);
});

Connection(url);

// // 4️⃣ Run polling every 60 seconds
setInterval(checkNewVideos, 5 * 1000);
console.log('🚀 Polling service started... Checking for new videos every 1 minute.');

setInterval(checkingInDB, 3600*1000);