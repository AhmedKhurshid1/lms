var AWS = require('aws-sdk');
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION, S3_BUCKET } = require('../config');

AWS.config.update({
  "accessKeyId": AWS_ACCESS_KEY_ID,
  "secretAccessKey": AWS_SECRET_ACCESS_KEY,
  "region": REGION,
});
const s3 = new AWS.S3();

const uploadPictureToS3 = async (key, body) => {
  const result = await s3.upload({
    Bucket: S3_BUCKET,
    Key: key,
    Body: body,
  }).promise();

  return result;
}

const createFolderOnS3 = async (key) => {

  const result = s3.putObject({

    Key: `${key}/`, // This should create an empty object in which we can store files 
    Bucket: S3_BUCKET,
  }).promise();


  return result;
}


const uploadPictureToS3object = async (obj) => {
  const result = await s3.upload({
    Bucket: S3_BUCKET,
    Key: obj.key,
    Body: obj.body,
  }).promise();

  return result;
}

const uploadMultiplePicturesToS3 = async (key, body) => {
  const result = await s3.upload({
    Bucket: S3_BUCKET,
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
  });

  return result;
}

async function emptyS3Directory(dir) {
  bucket = S3_BUCKET
  const listParams = {
    Bucket: bucket,
    Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  console.log({ listedObjects, data: listedObjects?.Contents })
  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

const getFolderObject = async (key) => {
  bucket = S3_BUCKET

  var params = {
    Bucket: bucket,
    Delimiter: '/',
    Prefix: key
  };
  var object = await s3.listObjects(params).promise();
  var keys = object.Contents.map(value => value.Key);
  const promise = keys.map(getObject);
  const data = await Promise.all(promise);
  return data;
}

const getObject = async (key) => {



  try {
    const params = {
      Bucket: S3_BUCKET,
      Key: key
    }

    const data = await s3.getObject(params).promise();
    return data.Body.toString('base64');

  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }

}

const uploadPDFToS3 = async (key, body) => {
  const result = await s3.upload({
    Bucket: S3_BUCKET,
    Key: key,
    Body: body,
  }).promise();

  return result;
}


module.exports = {
  uploadPictureToS3,
  uploadMultiplePicturesToS3,
  getObject,
  emptyS3Directory,
  getFolderObject,
  uploadPictureToS3object,
  createFolderOnS3,
  uploadPDFToS3,
}