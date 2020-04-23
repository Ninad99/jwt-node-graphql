import { Request, Response } from 'express';

export interface AuthContext {
	req: Request;
	res: Response;
	payload?: { userId: string; username: string; email: string };
}
