import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Connection } from './db/db';
import { attachSolution } from './Controller/addLink';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Ensure JSON parsing middleware is included

const port = 3000;
const url = process.env.DATABASE_URL || '';

// ✅ Use `express.Router()` instead of `app.router()`
const router = express.Router(); 

router.post('/attachSolution', attachSolution);

// ✅ Mount the router in the app
app.use('/api', router);

app.listen(port, () => {
    console.log('Server running on port:', port);
});

Connection(url);
