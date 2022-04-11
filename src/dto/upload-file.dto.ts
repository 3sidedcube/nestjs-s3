export class S3UploadFileDTO {
    // File contents
    file: any;

    // File name
    key: string;

    contentType: string;

    // Override default bucket
    bucket?: string;
}
