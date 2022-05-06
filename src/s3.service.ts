// tslint:disable: variable-name
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Inject } from '@nestjs/common';
import { S3_OPTIONS } from './constants';
import { S3Options } from './interfaces';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IDeleteFilePayload } from './delete/delete.interface';
import { S3UploadFileDTO } from './dto/upload-file.dto';

interface IS3Service {
    getSignedUrl(fileName: string, fileType: string): Promise<{ signedUrl: string; url: string }>;
    removeFile(keys: string[]): Promise<void>;
}

@Injectable()
export class S3Service implements IS3Service {
    private readonly client: S3Client;
    private readonly bucket: string;
    constructor(
        @Inject(S3_OPTIONS) private _S3Options: S3Options,
        @InjectQueue('removes3') private deleteQueue: Queue,
    ) {
        this.client = new S3Client({
            credentials: {
                accessKeyId: this._S3Options.accessKeyId,
                secretAccessKey: this._S3Options.accessKey,
            },
            region: this._S3Options.region,
        });
        this.bucket = this._S3Options.bucketName;
    }

    /**
     * Gets the S3 signed URL from filename and filetype, used for uploading files
     * @param fileName Formatted filename
     * @param fileType File type
     * @returns S3 Signed URL and URL
     */
    async getSignedUrl(fileName: string, fileType: string): Promise<{ signedUrl: string; url: string }> {
        const s3Params = {
            Bucket: this._S3Options.bucketName,
            Key: fileName,
            ContentType: fileType,
            ACL: this._S3Options.defaultObjectACL ?? 'public-read',
        };

        const signedUrl = await getSignedUrl(this.client, new PutObjectCommand(s3Params), {});
        const url = `${this._S3Options.bucketUrl}/${fileName}`;
        return { signedUrl, url };
    }

    /**
     * Uploads file contents to S3 bucket URL from filename and filetype, used for uploading files
     * @param input Input containing file information required to upload
     * @returns S3 Response
     */
    async uploadFile(input: S3UploadFileDTO): Promise<PutObjectCommandOutput> {
        return this.client.send(
            new PutObjectCommand({
                Key: input.key,
                ContentType: input.contentType,
                Body: input.file,
                Bucket: input.bucket ?? this.bucket,
            }),
        );
    }

    /**
     * Add S3 files to deletion queue
     * @param keys Array of file paths relative to the bucket
     * @returns void
     */
    async removeFile(keys: string[]): Promise<void> {
        const payload: IDeleteFilePayload = {
            keys,
        };
        await this.deleteQueue.add(payload);
    }
}
