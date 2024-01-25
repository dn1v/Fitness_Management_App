import multer from 'multer';
import { BadRequestException } from '../exceptions/badRequestException';
import { ErrorMessages } from '../constants/errorMessages';

// const storage = multer.memoryStorage();

// export const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     // if (!file.originalname.endsWith('.xlsx')) {
//     //   return cb(new BadRequestException(ErrorMessages.BAD_REQUEST))
//     // }
//     cb(null, true)
//     // if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//     //   // Validate MIME type for Excel (.xlsx)
//     //   cb(null, true);
//     // } else {
//     //   cb(new Error('Invalid file type. Please upload an Excel file.'));
//     // }
//   },
// });

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });