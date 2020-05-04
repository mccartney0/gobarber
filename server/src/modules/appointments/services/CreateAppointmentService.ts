import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	date: Date;
}

class CreateAppointmentService {
	constructor(private appointmentsRepository: IAppointmentRepository) {}

	public async execute({
		date,
		provider_id,
	}: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date);

		const findAppointmentsInSameDate = await this.appointmentsRepository.findByDate(
			appointmentDate,
		);

		if (findAppointmentsInSameDate) {
			throw new AppError('This appointment is already booked');
		}

		const appointment = await this.appointmentsRepository.create({
			provider_id,
			date: appointmentDate,
		});

		return appointment;
	}
}

export default CreateAppointmentService;
