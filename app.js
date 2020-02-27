const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');

const port = 8000;
const responsedelay = 50;   // miliseconds
const filespath = `./files`;

app.use(express.static('./'));

// home page
app.get('/', function(req, res)
{
    res.sendFile(`${__dirname}/view/index.html`);
});

// upload handler
var uploadStorage = multer.diskStorage(
{
    destination: function (req, file, cb)
    {
        cb(null, filespath);
    },
    filename: function (req, file, cb)
    {
        cb(null, file.originalname);    // file name must be verified before upload and if the file name is repeatitive then rename it
    }
});

var upload = multer({ storage: uploadStorage });

app.post('/', upload.single('file'), function(req, res)
{
    console.log(req.file);
    console.log('file upload...');
});

// all type of files except images will explored here
app.get('/files-list', function(req, res)
{
    let folder = filespath;
    let response = [];

    if(req.query.path)
        folder = req.query.path;

    fs.readdir(folder, function(err, files)
    {
        if(err)
        {
            console.log(err);
            res.send('').status(200);
        }
        else if(files.length > 0)
        {
            files.forEach(function(value, index, array)
            {
                fs.stat(`${folder}/${value}` , function(err, stats)
                {
                    let filesize;
                    try { filesize = ConvertSize(stats.size); }
                    catch(err) { filesize = 0; }
                    
                    response.push(
                    {
                        name: value,
                        path: folder,
                        size: filesize,
                        filetype: stats.isFile() ? 'file' : 'folder',
                        uploadDate: stats.birthtime // upload date is false and needs to fix
                    });
                    
                    if(index == (array.length - 1))
                        setTimeout(function() {res.send(JSON.stringify(response)).status(200);}, responsedelay);
                });
            });
        }
        else
        {
            // empty response doesn't need delay
            res.send('').status(200);
        }
    });
});

app.delete('/filedir/', function(req, res)
{
    console.log(req.query);
});

/**
 * it gives a number as byte and convert it to KB, MB and GB (depends on file size) and return the result as string.
 * @param number file size in Byte
 */
function ConvertSize(number)
{
    if(number <= 1024) { return (`${number} Byte`); }
    else if(number > 1024 && number <= 1048576) { return ((number / 1024).toPrecision(3) + ' KB'); }
    else if(number > 1048576 && number <= 1073741824) { return ((number / 1048576).toPrecision(3) + ' MB'); }
    else if(number > 1073741824 && number <= 1099511627776) { return ((number / 1073741824).toPrecision(3) + ' GB'); }
}

// start server
app.listen(port, function()
{
    console.log(`Server is started on port: ${port}`);
});