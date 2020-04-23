import { Response } from 'express';

export const setRefreshtoken = (res: Response, token: string) => {
	res.cookie('jref', token, {
		httpOnly: true,
		path: '/refresh_token',
	});
};
