import { S3Options } from './s3-options.interface';

export interface S3OptionsFactory {
    createS3Options(): Promise<S3Options> | S3Options
}
