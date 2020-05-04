import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UsersController {
	public async create(req: Request, res: Response): Promise<Response> {
		try {
			const { name, email, password } = req.body;

			const createUser = container.resolve(CreateUserService);

			const user = await createUser.execute({ name, email, password });

			delete user.password;

			return res.json(user);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	public async update(req: Request, res: Response): Promise<Response> {
		const updateUserAvatar = container.resolve(UpdateUserAvatarService);

		const user = await updateUserAvatar.execute({
			user_id: req.user.id,
			avatarFilename: req.file.filename,
		});

		delete user.password;

		return res.json(user);
	}
}
