require('dotenv').config();
// eslint-disable-next-line import/no-dynamic-require
// const M = require(`${process.env.PACK}`);
const M = require('backblaze-b2');

const M_KEY_ID = `${process.env.KEY_ID}`;
const M_APP_KEY = `${process.env.APP_KEY}`;
const M_BUCKET_ID = `${process.env.BUCKET_ID}`;
const fs = require('fs');
const path = require('path');

const b2 = new M({
    applicationKeyId: M_KEY_ID,
    applicationKey: M_APP_KEY,
});

async function backBlazeSingle(file) {
    await b2.authorize();

    // Read the file data into a Buffer
    const fileData = file.buffer;
    // const fileData = fs.readFileSync(file.path);

    console.log(file);
    const fileExt = path.extname(file.originalname);
    const fileFirstName = `${file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-')}-${Date.now()}`;

    const fileName = `${file.fieldname}-${fileFirstName}${fileExt}`;

    // Set the file name and MIME type
    // const fileName = file.filename;
    const mimeType = file.mimetype;

    // Get an upload URL and authorization token from Backblaze M
    const { data } = await b2.getUploadUrl({
        bucketId: M_BUCKET_ID,
    });
    // console.log(data);

    const { uploadUrl } = data;
    const uploadAuthToken = data.authorizationToken;

    // Upload the file to Backblaze M using the upload URL and authorization token
    const response = await b2.uploadFile({
        uploadUrl,
        uploadAuthToken,
        fileName,
        data: fileData,
        mime: mimeType,
    });

    if (response.status === 200) {
        const downloadUrl = `${process.env.DOWNLOAD_PREFIX}/${fileName}`;

        return downloadUrl;
    }
    return 'bad_url';

    // Get the download URL for the uploaded file
}

module.exports = backBlazeSingle;
