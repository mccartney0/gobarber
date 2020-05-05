import multer from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

export default {
	tmpFolder,
	uploadFolder: resolve(tmpFolder, 'uploads'),

	storage: multer.diskStorage({
		destination: uploadFolder,
		filename(request, file, cb) {
			const fileHash = randomBytes(10).toString('HEX');
			const fileName = `${fileHash}-${file.originalname}`;

			return cb(null, fileName);
		},
	}),
};
