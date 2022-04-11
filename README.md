# S3

Get signed URLs and delete hosted files via a queue

### Installation

The project is hosted on our private npm registry, so to install simply run

##### npm

```bash
npm i @chelseaapps/s3
```

##### yarn

```bash
yarn add @chelseaapps/s3
```

#### Config options

| Option      | Description                        | Example                                     |
| ----------- | ---------------------------------- | ------------------------------------------- |
| bucketName  | S3 bucket name                     | ca-media                                    |
| bucketUrl   | URL of bucket (Without trailing /) | https://ca-media.s3.eu-west-2.amazonaws.com |
| accessKeyId | S3 access key ID                   | RXIARTJAQWWNM3Q3QEXQ                        |
| accessKey   | S3 access key                      | GTIARTJAQWWNM3Q3QEXQ                        |
| region      | S3 Region                          | eu-west-2                                   |

The module can be configured in two ways:

-   Regular
-   Asynchronous

### Usage

Import the S3Service into a module using the Nest depedency injection mechanism.

```typescript
import { S3Service } from "@chelseaapps/s3"

@Injectable()
export class UserService {
	constructor(
		private s3Service: S3Service,
	) {}

    ...
    async signedUrl() {
        await this.s3Service.getSignedUrl("image.png", "image/png")
    }

    async removeFile() {
        // Array of file paths relative to the bucket. If it's in a directory, you must include the relative path (e.g directory/image.png)
        await this.s3Service.removeFile(["image.png"])
    }
}
```
### S3Service API
* `async getSignedUrl(fileName: string, fileType: string): Promise<{ signedUrl: string; url: string }>`
  - Takes file name and the MIME type (http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17) of the file and returns an object with the `signedUrl` and the `url` which is a complete url location of the file in the bucket.

* `async uploadFile(input: S3UploadFileDTO): Promise<PutObjectCommandOutput>`
  - Takes an input DTO, which has the following parameters:
    - `file` - The content of the file
    - `key` - key for the file in the bucket
    - `contentType` - MIME type for the file (http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17)
    - `bucket` (optional) - overrides the default bbucket of the service defined in the config

* `async removeFile(keys: string[]): Promise<void>`
  - Takes a list of keys that point to the files that are required to be deleted in the bucket specified in the config.
