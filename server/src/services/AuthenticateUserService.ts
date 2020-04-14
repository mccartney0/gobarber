import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
	email: string;
	password: string;
}

class AuthenticateUserService {
	public async execute({
		email,
		password,
	}: Request): Promise<{ user: User; token: string }> {
		const usersRepository = getRepository(User);

		const user = await usersRepository.findOne({ where: { email } });
		if (!user) {
			throw new Error('Incorrect e-mail/password combination');
		}

		const passwordMatched = await compare(password, user.password);
		if (!passwordMatched) {
			throw new Error('Incorrect e-mail/password combination');
		}

		const token = sign({}, '8d4bde4ec6aece4c8eb5a94e73ca1556', {
			subject: user.id,
			expiresIn: '1d',
		});

		return { user, token };
	}
}

export default AuthenticateUserService;
