import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route'; //

const app: Application = express();

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // tomar frontend url
    credentials: true // cookie pathanor jonno eta dorkar
}));
app.use(cookieParser());

// Testing Route
app.get('/', (req: Request, res: Response) => {
    res.send("Ecommerce API is running with TS, JWT & Cookies!");
});


app.use("/api", authRoutes);

export default app;