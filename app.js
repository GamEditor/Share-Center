const fileUtility = require('./modules/FileUtility');

const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');

const port = 8000;
const responsedelay = 50;   // miliseconds
const rootPath = `userdata/files`;

app.use(express.static('./userdata'));
app.use(express.static('./project'));

// home page
app.get('/', function (req, res) {
    res.sendFile(`${__dirname}/project/view/index.html`);
});

// upload handler
var uploadStorage = multer.diskStorage({
    // file name must be verified before upload and if the file name is repeatitive then rename it
    destination: function (req, file, cb) { cb(null, req.query.path); },
    filename: function (req, file, cb) { cb(null, file.originalname); }
});

var upload = multer({ storage: uploadStorage });

app.post('/', upload.any(), function (req, res) {
    res.status(200).send();
    console.log(req.files);
    console.log('file upload...');
});

// all type of files except images will explored here
app.get('/files-list', function (req, res) {
    let rootFolder;
    let folder;
    let response = [];

    if (req.query.path)
        rootFolder = req.query.path;

    if (!fs.existsSync(rootFolder))
        rootFolder = rootPath;

    folder = rootFolder.substring('userdata'.length + 1);

    fs.readdir(rootFolder, function (err, files) {
        if (err) {
            console.log(err);
            res.send('').status(200);
        } else if (files.length > 0) {
            files.forEach(function (value, index, array) {
                fs.stat(`${rootFolder}/${value}`, function (err, stats) {
                    let filesize;
                    try { filesize = fileUtility.getFileSize(stats.size); }
                    catch (err) { filesize = 0; }

                    const fileExtension = value.split('.');
                    const isFile = stats.isFile();

                    response.push({
                        name: value,
                        path: isFile ? folder : rootFolder,
                        size: filesize,
                        filetype: isFile ? 'file' : 'folder',
                        extension: isFile ? fileExtension[fileExtension.length - 1] : 'folder',
                        uploadDate: stats.birthtime // upload date is false and needs to fix
                    });

                    if (index == (array.length - 1))
                        setTimeout(function () { res.send(JSON.stringify(response)).status(200); }, responsedelay);
                });
            });
        } else {
            // when directory is empty
            response.push({
                path: rootFolder,
                filetype: 'folder',
            });

            res.send(JSON.stringify(response)).status(200);
        }
    });
});

app.delete('/filedir/', function (req, res) {
    console.log(req.query);
});

// start server
app.listen(port, function () {
    console.log(`Server is started on port: ${port}`);
});