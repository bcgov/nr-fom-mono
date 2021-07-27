var Minio = require('minio')

// Create the environment variables locally
export const minioClient =  new Minio.Client({
    endPoint:  process.env.OBJECT_STORAGE_URL,
    accessKey: process.env.OBJECT_STORAGE_ACCESS_ID,
    secretKey: process.env.OBJECT_STORAGE_SECRET
});

export function verifyObjectStorageConnection() {
    if (!process.env.OBJECT_STORAGE_ACCESS_ID || !process.env.OBJECT_STORAGE_SECRET) {
        console.log("Error object storage credentials not provided.");
        return;
    }
    minioClient.listBuckets(function(err, buckets) {
        if (err) { 
         console.log("Error connecting to object storage");
         console.log(err);
         return;
        } 
        
        console.log('Succssful connection to object storage. Buckets accessible = ' + buckets.length);
      });
}

verifyObjectStorageConnection();


