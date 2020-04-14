import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
	try {
		const { email, password } = req.body;

		const authenticateUser = new AuthenticateUserService();
		const { user } = await authenticateUser.execute({ email, password });

		delete user.password;

		return res.json({ user });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

export default sessionsRouter;
