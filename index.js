import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(express.static("public"));
app.use(express.static("files"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        if (err) {
            console.error("Error reading files:", err);
            return res.status(500).send("An error occurred while reading tasks.");
        }
        res.render("index", { files: files });
    });
});

app.post('/create', function (req, res) {
    const fileName = `${req.body.title.split(' ').join('')}.txt`; 
    const filePath = `./files/${fileName}`;
    
    fs.writeFile(filePath, req.body.details, function (err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("An error occurred while creating the task.");
        }
        res.redirect('/');
    });
});

app.get('/task/:fileName', function (req, res) {
    const fileName = req.params.fileName;
    const filePath = `./files/${fileName}`;
    
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("An error occurred while reading the task.");
        }
        res.render("task", { title: fileName.replace('.txt', ''), details: data });
    });
});


app.get('/edit/:fileName', function (req, res) {
    const fileName = req.params.fileName;
    const filePath = `./files/${fileName}`;

    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("An error occurred while reading the task.");
        }
        res.render("edit", { title: fileName.replace('.txt', ''), details: data, fileName: fileName });
    });
});

app.post('/edit/:fileName', function (req, res) {
    const fileName = req.params.fileName;
    const filePath = `./files/${fileName}`;

    fs.writeFile(filePath, req.body.details, function (err) {
        if (err) {
            console.error("Error updating file:", err);
            return res.status(500).send("An error occurred while updating the task.");
        }
        res.redirect('/');
    });
});

app.post('/delete/:fileName', function (req, res) {
    const fileName = req.params.fileName;
    const filePath = `./files/${fileName}`;

    fs.unlink(filePath, function (err) {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).send("An error occurred while deleting the task.");
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
