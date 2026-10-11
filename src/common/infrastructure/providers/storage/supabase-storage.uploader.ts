
import { ListBucketsCommand } from "@aws-sdk/client-s3"
import { UploaderProps, UploaderProvider } from "@/common/domain/providers/uploader-provider";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../../env";

export class StorageUploader implements UploaderProvider {
    
    private readonly client: S3Client

    constructor() {
        this.client = new S3Client({
            endpoint: `${env.SUPABASE_STORAGE_URL}`,
            region: 'us-east-2',
            forcePathStyle: true,
            credentials: {
                accessKeyId: env.AWS_ACESS_KEY_ID!,
                secretAccessKey: env.AWS_SECRET_ACESS_KEY!
            }
        })
    }

    async upload({ filename, filetype, body }: UploaderProps): Promise<string> {
        console.log('enviando')

// const result = await this.client.send(new ListBucketsCommand({}))
// console.log(result.Buckets?.map(bucket => bucket.Name))
        await this.client.send(new PutObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: filename,
            ContentType: filetype,
            Body: body
        }))

        return filename

    }

}
