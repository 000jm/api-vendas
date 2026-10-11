
import BadRequestError from "@/common/domain/errors/bad-request-error"
import multer from "multer"

export const upload = multer({
    
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: (req, file, callback) => {
    
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        
        if(!allowedMimes.includes(file.mimetype)) callback(new BadRequestError('Invalid file type'))

        callback(null, true)
        
    }

})
