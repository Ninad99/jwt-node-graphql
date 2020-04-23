import {
	Resolver,
	Query,
	Mutation,
	Arg,
	ObjectType,
	Field,
	Ctx,
	UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entity/User';
import { AuthContext } from '../context/authContext';
import { createRefreshToken, createAccessToken } from '../util/auth';
import { isAuth } from '../middleware/isAuth';
import { setRefreshtoken } from '../util/setRefreshToken';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
	@Field(() => User)
	user: User;
}

@ObjectType()
class RegisterResponse {
	@Field()
	accessToken: string;
	@Field(() => User)
	user: User;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	sayHello() {
		return 'helloooooooo!';
	}

	@Query(() => String)
	sayHelloTo(@Arg('name') name: string) {
		return `helloooooooo ${name}!`;
	}

	@Query(() => User)
	@UseMiddleware(isAuth)
	getUserInfo(@Ctx() { payload }: AuthContext) {
		return User.findOne({ where: { id: payload?.userId } });
	}

	@Query(() => [User])
	getUsers() {
		return User.find();
	}

	@Mutation(() => RegisterResponse)
	async register(
		@Arg('name') name: string,
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: AuthContext
	) {
		const hashedPassword = await hash(password, 12);
		try {
			const user = new User();
			user.name = name;
			user.email = email;
			user.password = hashedPassword;
			await user.save();

			setRefreshtoken(res, createRefreshToken(user));

			return {
				accessToken: createAccessToken(user),
				user,
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: AuthContext
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			throw new Error('Could not find user');
		}

		const valid = await compare(password, user.password);
		if (!valid) {
			throw new Error('Incorrect password');
		}

		setRefreshtoken(res, createRefreshToken(user));

		return {
			accessToken: createAccessToken(user),
			user,
		};
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { res }: AuthContext) {
		setRefreshtoken(res, '');
		return true;
	}
}
