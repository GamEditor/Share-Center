const fileUtility = require('./modules/FileUtility');
const browserCheck = require('./modules/browserCheck');

const express = require('express');
const app = express();

const mysql = require('mysql');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const fs = require('fs');
const multer = require('multer');

const port = 8000;
const responsedelay = 50;   // miliseconds
const rootPath = `userdata/files`;

app.use(express.static('./userdata'));
app.use(express.static('./project'));

app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    cookie: { maxAge: 60000 },  // 1 min
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'ShareCenterAuth'
// });

function isLoggedIn(req) {
    // return req.session.loggedin ? true : false;  // handle your authentication yourself
    return true;
}

function auth(req, res, next) {
    // console.log({ loggedIn: isLoggedIn(req), path: req.path, useragent: req.headers['user-agent'] });

    // some client side apis doesn't work on IE. so i decided to stop supporting this browser
    if (browserCheck.isSupportedBrowser(req.headers['user-agent'])) {
        res.sendFile(`${__dirname}/project/view/notsupported.html`);
    } else if (!isLoggedIn(req)) {
        res.sendFile(`${__dirname}/project/view/login.html`);
        res.status(401);
    } else
        next();
}

// home page
app.get('/', auth, function (req, res) {
    res.sendFile(`${__dirname}/project/view/index.html`);
});

app.post('/auth', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // if (username && password) {
    //     connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
    //         if (results.length > 0) {
    //             req.session.loggedin = true;
    //             req.session.username = username;
    //             res.redirect('/');
    //         } else {
    //             res.send('Incorrect Username and/or Password!');
    //             res.status(401);
    //         }
    //     });
    // } else {
    //     res.send('Please enter Username and Password!');
    // }
});

// upload handler
var uploadStorage = multer.diskStorage({
    // file name must be verified before upload and if the file name is repeatitive then rename it
    destination: function (req, file, cb) { cb(null, `userdata/${req.query.path}`); },
    filename: function (req, file, cb) { cb(null, file.originalname); }
});

var upload = multer({ storage: uploadStorage });

app.post('/', upload.any(), function (req, res) {
    res.status(200).send();
    console.log(req.files);
    console.log('file upload...');
});

// all type of files except images will explored here
app.get('/files-list', auth, function (req, res) {
    let rootFolder;
    let response = [];

    if (req.query.path)
        rootFolder = `userdata/${req.query.path}`;

    if (!fs.existsSync(rootFolder))
        rootFolder = rootPath;

    const folder = rootFolder.indexOf('userdata') == 0 ? rootFolder.substring('userdata'.length + 1) : rootFolder;

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
                        path: folder,
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
                path: folder,
                filetype: 'folder',
            });

            res.send(JSON.stringify(response)).status(200);
        }
    });
});

app.put('/', function (req, res) {
    const newFolder = `userdata/${req.query.newfolder}`;
    fs.mkdir(newFolder, function (err) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send();
    });
});

app.delete('/filedir/', function (req, res) {
    console.log(req.query);
});

app.get('*', auth, function (req, res) {
    res.send(`${req.path} is not a valid route!`);
});

// start server
app.listen(port, function () {
    console.log(`Server is started on port: ${port}`);
});