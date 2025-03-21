"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db/db");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
dotenv_1.default.config();
const port = 3000;
const url = process.env.DATABASE_URL || '';
app.listen(port, () => {
    console.log("server running on port: ", port);
});
(0, db_1.Connection)(url);
