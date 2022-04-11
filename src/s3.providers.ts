import { S3Options } from './interfaces';
import { S3_OPTIONS } from './constants';
import { Provider } from '@nestjs/common';

export function createS3Providers(options: S3Options): Provider[] {
    return [
        {
            provide: S3_OPTIONS,
            useValue: options,
        },
    ];
}
