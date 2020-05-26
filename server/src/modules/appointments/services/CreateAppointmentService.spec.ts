import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeNotificationsRepository = new FakeNotificationsRepository();
		fakeCacheProvider = new FakeCacheProvider();

		createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
			fakeNotificationsRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to create a new appointment', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appointment = await createAppointment.execute({
			date: new Date(2020, 4, 10, 13),
			provider_id: 'provider-id',
			user_id: 'user-id',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('provider-id');
	});

	it('should not be able to create two appointments on the same date', async () => {
		const appointmentRepeatedDate = new Date(2020, 4, 10, 15);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await createAppointment.execute({
			date: appointmentRepeatedDate,
			provider_id: 'provider-id',
			user_id: 'user-id',
		});

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: appointmentRepeatedDate,
				provider_id: 'provider-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment on a past date', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 11),
				provider_id: 'user-id',
				user_id: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment with same user as provider', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 13),
				provider_id: 'user-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment out of 8AM to 17PM range', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 7),
				provider_id: 'user-id',
				user_id: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 18),
				provider_id: 'user-id',
				user_id: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
