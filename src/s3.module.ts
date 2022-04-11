import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3_OPTIONS } from './constants';
import { S3Options, S3AsyncOptions, S3OptionsFactory } from './interfaces';
import { createS3Providers } from './s3.providers';
import { BullModule } from '@nestjs/bull';
import { DeleteFileConsumer } from './delete/delete.consumer';

@Global()
@Module({
    providers: [S3Service, DeleteFileConsumer],
    exports: [S3Service],
})
export class S3Module {
    /**
     * Registers a configured S3 Module for import into the current module
     */
    public static register(options: S3Options): DynamicModule {
        return {
            module: S3Module,
            providers: createS3Providers(options),
            imports: this.createImports(),
        };
    }

    /**
     * Registers a configured S3 Module for import into the current module
     * using dynamic options (factory, etc)
     */
    public static registerAsync(options: S3AsyncOptions): DynamicModule {
        return {
            module: S3Module,
            providers: [...this.createProviders(options)],
            imports: this.createImports(),
        };
    }

    private static createProviders(options: S3AsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createOptionsProvider(options)];
        }

        return [
            this.createOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createOptionsProvider(options: S3AsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: S3_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        // For useExisting...
        return {
            provide: S3_OPTIONS,
            useFactory: async (optionsFactory: S3OptionsFactory) => await optionsFactory.createS3Options(),
            inject: [options.useExisting || options.useClass],
        };
    }

    /**
     * Register imports for module
     * @returns Imports
     */
    private static createImports(): DynamicModule[] {
        return [
            BullModule.registerQueue({
                name: 'removes3',
            }),
        ];
    }
}
