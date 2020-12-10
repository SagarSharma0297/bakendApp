var express = require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var port  = process.env.PORT || 4201
var connection = mysql.createConnection({
    host: "upptis.c8xet7vkqyyb.ap-south-1.rds.amazonaws.com",
    user: "vinesh",
    password: "vin@123",
    database: "ptis_dev"
});

connection.connect(function(error) {
    if(error){
        console.log('error');
    }else{
        console.log('conected');
    }
});
app.get('/',cors(),function(req,res) {
    res.send('YOUR APP IS RUNNING')
    });
    
app.get('/firstquery',cors(),function(req,res) {
    connection.query('select MapID,BuildingName from land_master', function(error,rows,fields) {
        if(!!error){
            console.log(error)
        }else{
            console.log('success');
            res.send(rows)
        }
    });
})
app.listen(port);