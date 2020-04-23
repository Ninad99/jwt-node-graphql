import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { AuthContext } from 'src/context/authContext';

export const isAuth: MiddlewareFn<AuthContext> = ({ context }, next) => {
	const auth = context.req.headers['authorization'];

	if (!auth) {
		throw new Error('Not authenticated!');
	}

	try {
		const token = auth.split(' ')[1];
		const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
		context.payload = payload as any;
	} catch (err) {
		throw new Error(err);
	}

	return next();
};
