import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { IDeleteFilePayload } from './delete.interface';
import { Inject, Logger } from '@nestjs/common';
import { S3_OPTIONS } from '../constants';
import { S3Options } from '../interfaces/s3-options.interface';

@Processor('removes3')
export class DeleteFileConsumer {
    private readonly client: S3Client;
    private readonly logger = new Logger(DeleteFileConsumer.name);

    constructor(@Inject(S3_OPTIONS) private _S3Options: S3Options) {
        this.client = new S3Client({
            credentials: {
                accessKeyId: this._S3Options.accessKeyId,
                secretAccessKey: this._S3Options.accessKey,
            },
            region: this._S3Options.region,
        });
    }

    @Process()
    async delete({ data }: Job<IDeleteFilePayload>): Promise<void> {
        const { keys } = data;

        const objects = [];

        for (const k in keys) {
            keys[k] = String(keys[k]);
            if (!keys[k] || typeof keys[k] !== 'string') continue;
            objects.push({ Key: keys[k] });
        }

        const options = {
            Bucket: this._S3Options.bucketName,
            Delete: {
                Objects: objects,
            },
        };

        this.logger.verbose(`Deleting files from S3 [${keys.join(', ')}]`);

        await this.client.send(new DeleteObjectsCommand(options));
    }
}
