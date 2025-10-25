import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const storage = new Storage({
    projectId: "bogeypad",
    keyFilename: "./service-account.json", // Path to service account key file
});

const bucketName = 'bogey-pad-bucket';
export const bucket = storage.bucket(bucketName);

// To upload
export const uploadFile = async (localPath, destinationPath) => {
    await bucket.upload(localPath, {
        destination: destinationPath,
        gzip: true,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });
    console.log(`${localPath} uploaded to ${bucketName}/${destinationPath}`);
}

// To download
export const downloadFile = async (sourceFilename, destinationPath) => {
    const file =  bucket.file(sourceFilename);
    await file.download({ destination: destinationPath });
    console.log(`${sourceFilename} downloaded to ${destinationPath}`)
}

// Read file as buffer
export const readFileBuffer = async (sourceFilename) => {
    const file = bucket.file(sourceFilename);
    const [contents] = await file.download();
    return contents;
}

// Delete a file
export const deleteFile = async (sourceFilename) => {
    await storage.bucket(bucketName).delete();
    console.log(`gs://${bucketName}/${sourceFilename} deleted.`);
}

// Get image url
export const getImageUrl = async (filename) => {
    try {
        const [url] = await bucket.file(filename).getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // 1 hour
        });
        console.log(`Generated signed URL: ${url}`);
        return url;
    } catch (error) {
        console.error('Error generating signed URL', error);
        return null;
    }
}