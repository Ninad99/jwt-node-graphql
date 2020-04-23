import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../entity/User';
import { createAccessToken, createRefreshToken } from '../util/auth';
import { setRefreshtoken } from '../util/setRefreshToken';

export const handleRefreshToken = async (req: Request, res: Response) => {
	const token = req.cookies.jref;
	if (!token) {
		return res.json({ ok: false, accessToken: '' });
	}

	let payload = null;
	try {
		payload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as any;
	} catch (err) {
		return res.send({ ok: false, accessToken: '' });
	}

	const user = await User.findOne({ id: payload.userId });
	if (!user) {
		return res.send({ ok: false, accessToken: '' });
	}

	setRefreshtoken(res, createRefreshToken(user));
	return res.send({ ok: true, accessToken: createAccessToken(user) });
};
