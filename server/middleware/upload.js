import multer from 'multer';

// Use memory storage so we can process PDFs as buffers
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed. Please upload a PDF resume.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware for single resume upload
export const uploadSingle = upload.single('resume');

// Middleware for bulk resume upload (up to 10 at once)
export const uploadBulk = upload.array('resumes', 10);
