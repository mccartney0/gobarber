import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
	public async index(req: Request, res: Response): Promise<Response> {
		const { provider_id } = req.params;
		const { month, day, year } = req.query;

		const listProviderDayAvailability = container.resolve(
			ListProviderDayAvailabilityService,
		);

		const availability = await listProviderDayAvailability.execute({
			provider_id,
			month: Number(month),
			day: Number(day),
			year: Number(year),
		});

		return res.json(availability);
	}
}
