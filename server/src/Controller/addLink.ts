import { Request, Response } from 'express';
import Contest from '../model/model';


export const attachSolution = async (req: Request, res: Response) => {
    try {
        const { id, url, host } = req.body;

        if (!id || !url || !host) {
            return res.status(400).json({ message: "All Fields Required" });
        }
        const response = await Contest.findOneAndUpdate({ id, host }, {url:url});

        if (!response) {
            return res.status(500).json({ message: "Error in saving solution" });
        }

        return res.status(201).json({ message: "Submitted Link", data: response });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};
