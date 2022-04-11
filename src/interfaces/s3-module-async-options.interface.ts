/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
import { S3Options } from './s3-options.interface';
import { S3OptionsFactory } from './s3-options-factory.interface';

export interface S3AsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[]
    useExisting?: Type<S3OptionsFactory>
    useClass?: Type<S3OptionsFactory>
    useFactory?: (...args: any[]) => Promise<S3Options> | S3Options
}
