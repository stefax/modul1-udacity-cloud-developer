import AWS = require('aws-sdk');
import { config } from './config/config';

//Configure AWS
if (config.aws.aws_profile !== "DEPLOYED") {
    var credentials = new AWS.SharedIniFileCredentials({profile: config.aws.aws_profile});
    AWS.config.credentials = credentials;
}

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws.aws_region,
  params: {Bucket: config.aws.aws_media_bucket}
});

function getSignedUrl(key: string, operation: string): string {
    const signedUrlExpireSeconds = 60 * 5;
    const params = {
        Bucket: config.aws.aws_media_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds
    };
    const url: string = s3.getSignedUrl(operation, params);

    return url;
}
/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl( key: string ): string{
    return getSignedUrl(key, 'getObject');
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl( key: string ): string{
    return getSignedUrl(key, 'putObject');
}