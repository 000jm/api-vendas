import type { UploaderProps, UploaderProvider } from '@/common/domain/providers/uploader-provider'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env } from '@/common/infrastructure/env'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

export class StorageUploader implements UploaderProvider {

    private readonly client: S3Client | null
    private readonly uploadDir = path.resolve(process.cwd(), 'uploads')

    constructor() {

        if (env.STORAGE_DRIVER === 'supabase') {
            this.client = new S3Client({
                endpoint: env.SUPABASE_STORAGE_URL,
                region: 'auto',
                forcePathStyle: true,
                credentials: {
                    accessKeyId: env.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!
                }
            })
        } else {
            this.client = null
        }

    }

    async upload({ filename, filetype, body }: UploaderProps): Promise<string> {

        if (env.STORAGE_DRIVER === 'local') {
            await mkdir(this.uploadDir, { recursive: true })
            await writeFile(path.join(this.uploadDir, filename), body)
            return filename
        }

        await this.client!.send(new PutObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: filename,
            ContentType: filetype,
            Body: body
        }))

        return filename

    }

    async delete(filename: string): Promise<void> {

        if (!filename) return

        if (env.STORAGE_DRIVER === 'local') {
            try {
                await unlink(path.join(this.uploadDir, filename))
            } catch (error: any) {
                if (error?.code !== 'ENOENT') throw error
            }
            return
        }

        await this.client!.send(new DeleteObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: filename,
        }))

    }

}
