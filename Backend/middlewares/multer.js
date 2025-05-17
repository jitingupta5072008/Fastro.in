import multer from 'multer';

// Use memory storage instead of disk to avoid file system issues
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
