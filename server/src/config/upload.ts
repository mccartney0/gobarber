import multer from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

const uploadFolder = resolve(__dirname, '..', '..', 'tmp', 'uploads');

export default {
	directory: uploadFolder,

	storage: multer.diskStorage({
		destination: uploadFolder,
		filename(request, file, cb) {
			const fileHash = randomBytes(10).toString('HEX');
			const fileName = `${fileHash}-${file.originalname}`;

			return cb(null, fileName);
		},
	}),
};
