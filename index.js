const fs = require('fs');
const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://master:putyourownpassword@rest-tutorial-instance.000000000000.us-west-2.docdb.amazonaws.com:27017/rest-tutorial?ssl=true";

var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];

var connection = function (callback) {
    MongoClient.connect(url, { useNewUrlParser: true, sslCA: ca, useUnifiedTopology: true }, callback)
}


app.post('/end-point', (req, res) => {

    var values = {
        title: req.param('title'),
        author: req.param('author'),
        body: req.param('body'),
        url: req.param('url')
    };

    connection(function (err, db) {

        if (err) throw err;
        var dbo = db.db("rest-tutorial");

        dbo.collection("articles").insertOne(values, function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });

    });

});


app.get('/end-point', (req, res) => {

    var title = {};
    if(req.param('title') != undefined)
            title = { title:  req.param('title') };

    connection(function (err, db) {

        if (err) throw err;
        var dbo = db.db("rest-tutorial");

        dbo.collection("articles").find(title).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });

    });

});


app.put('/end-point', function (req, res) {

    var title = req.param('title');
    var query = { title: title };

    var values = {
        title: title,
        author: req.param('author'),
        body: req.param('body'),
        url: req.param('url')
    };

    connection(function(err, db) {

        if (err) throw err;
        var dbo = db.db("rest-tutorial");

        dbo.collection("articles").updateOne(query, { $set: values }, function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });

    });

});


app.delete('/end-point', function (req, res) {

    var query = { title: req.param('title') };

    connection(function (err, db) {

        if (err) throw err;
        var dbo = db.db("rest-tutorial");

        dbo.collection("articles").deleteOne(query, function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });

    });

});


app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});
