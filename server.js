require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const AWS = require('aws-sdk');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const compression = require('compression');

//create a S3 instance
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET
});

app.use(cors());
app.use(fileUpload()); //handles file upload multipart/form-data
app.use(compression()); //gzip compress

//serve static react assets - chunked js files, css
app.use(express.static(path.join(__dirname, 'build')));

//file upload
app.post('/upload', (req, res) => {
    console.log('*** File Upload Called ***\n');
    console.log(req.files.file); //file is the name that comes in POST body

    const fileData  = req.files.file; //reg.files is provided by express-fileupload

    //upload files to S3 bucket
    //Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileData.name, // File name you want to save as in S3
        Body: fileData.data //file content/binary data
    };

    //upload to S3 
    s3.upload(params, (err, data) => {
        if(err) {
            res.status(500);
            res.send('File Upload to S3 Failed');
        }
        console.log('\nFile Uploaded: ', data);
        res.send(`${data.Location}`);
    });
});

//serve the production build
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8081, () => {
    console.log('** server running at 8081');
});