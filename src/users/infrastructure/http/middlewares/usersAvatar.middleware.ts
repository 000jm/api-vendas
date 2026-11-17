import BadRequestError from '@/common/domain/errors/bad-request-error'
import multer from 'multer'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const upload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: 1024 * 1024 * 3
    },

    fileFilter: (_req, file, callback) => {

        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            return callback(new BadRequestError('Formato de imagem inválido. Use JPEG, PNG ou WebP'))
        }

        callback(null, true)

    }

})
