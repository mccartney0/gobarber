import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
	public async index(req: Request, res: Response): Promise<Response> {
		const { day, month, year } = req.query;
		const provider_id = req.user.id;

		const listProviderAppointments = container.resolve(
			ListProviderAppointmentsService,
		);

		const appointments = await listProviderAppointments.execute({
			month: Number(month),
			day: Number(day),
			year: Number(year),
			provider_id,
		});

		return res.json(classToClass(appointments));
	}
}
