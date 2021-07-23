var Minio = require('minio')

// Create the environment variables locally
export const minioClient =  new Minio.Client({
    endPoint:  process.env.OBJECT_STORAGE_URL,
    accessKey: process.env.OBJECT_STORAGE_ACCESS_ID,
    secretKey: process.env.OBJECT_STORAGE_SECRET
});

export const bucket = process.env.OBJECT_STORAGE_BUCKET;

// export const minioClient =  new Minio.Client({
//   endPoint: 'nrs.objectstore.gov.bc.ca',
//   accessKey: process.env.npm_config_OBJECT_STORE_ACCESS_KEY,
//   secretKey: process.env.npm_config_OBJECT_STORE_SECRET_KEY
// });


minioClient.listBuckets(function(err, buckets) {
    if (err) return console.log(err)
    console.log('listing buckets, connected! :', buckets)
  })


// var metaData = {
//         'Content-Type': 'application/octet-stream',
//         'X-Amz-Meta-Testing': 1234,
//         'example': 5678
//     }

