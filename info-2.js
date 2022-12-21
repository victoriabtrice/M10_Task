import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mysql2 from 'mysql2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = 'localhost';
const port = 3000;
const app = express();

app.use(express.static('public'))
app.use(bodyParser.json())

const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

conn.connect((err) => {
    if(err) throw err;
    console.log('MySQL Connected...');
});

app.use(function(err,req,res,next) {
    res.send('Something broke!');
});

const myLog = (req, res, next) => {
    console.info('Request URL : ', `${req.originalUrl}`);
    console.info('Request Type : ', `${req.method}`);
    next();
};

app.get('/api/products', myLog, function(req, res, next){
    let sql = 'SELECT * FROM product';
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({'status': 200, 'error': null, 'response': results}));
        next();
    });
});

app.get('/api/product/:id', myLog, function(req, res, next){
    let sql = 'SELECT * FROM product WHERE product_id =' + req.params.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({'status': 200, 'error': null, 'response': results}));
        next();
    });
})

app.post('/api/products/', myLog, function(req, res, next){
    let data = {product_name : req.body.product_name, product_price : req.body.product_price}
    let sql = 'INSERT INTO product SET ?';
    let query = conn.query(sql, data, (err, results) => {
        if(req.body.product_price <= 0){
            res.send({'error': 'product_price tidak boleh <= 0'})
        }
        else if(isNaN(req.body.product_price)){
            res.send({'error' : 'product_price wajib diisi dengan angka'})
        }
        else {
            res.send(JSON.stringify({'status': 200, 'error': null, 'response': 'Insert data successfully'}));
        }
        next();
    });
})

app.put('/api/product/:id', myLog, function(req, res, next){
    let data = {product_name : req.body.product_name, product_price : req.body.product_price}
    let sql = "UPDATE product SET product_name = '"+req.body.product_name+"', product_price = '"+req.body.product_price+ "'WHERE product_id ="+req.params.id;
    let query = conn.query(sql, (err, results) => {
        if(req.body.product_price <= 0){
            res.send({'error': 'product_price tidak boleh <= 0'})
        }
        else if(isNaN(req.body.product_price)){
            res.send({'error' : 'product_price wajib diisi dengan angka'})
        }
        else {
            res.send(JSON.stringify({'status': 200, 'error': null, 'response': 'Update data successfully'}));
        }
        next();
    });
});

app.delete('/api/product/:id', myLog, function(req, res, next){
    let sql = 'DELETE FROM product WHERE product_id ='+ req.params.id+"";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({'status': 200, 'error': null, 'response': 'Delete data successfully'}));
        next();
    });
})

app.listen(port, () => {
    console.log(`Server running at ${hostname}:${port}`);
})