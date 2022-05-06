// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface S3Options {
    /**
     * S3 access key ID
     */
    accessKeyId: string;
    /**
     * S3 access key
     */
    accessKey: string;
    /**
     * S3 region
     */
    region: string;
    /**
     * S3 bucket URL
     */
    bucketUrl: string;
    /**
     * S3 bucket name
     */
    bucketName: string;
    /**
     * Default ACL to apply to uploaded objects.
     * Default `public-read`
     */
    defaultObjectACL?: 'public-read' | 'private';
}
