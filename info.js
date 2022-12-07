import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = 'localhost';
const port = 3000;
const app = express();

app.use(express.static('public'))
app.use(bodyParser.json())

app.use(function(err,req,res,next) {
    res.send('Something broke!');
});

const myLog = (req, res, next) => {
    console.info('Request URL : ', `${req.originalUrl}`);
    console.info('Request Type : ', `${req.method}`);
    next();
};

app.get('/api/products', myLog, function(req, res, next){
    next()
});

app.get('/api/product/:id', myLog, function(req, res, next){
    next()
})

app.post('/api/products/', myLog, function(req, res, next){
    let data = {product_name : req.body.product_name, product_price : req.body.product_price}
    if(req.body.product_price <= 0){
        res.send({'error': 'product_price tidak boleh <= 0'})
    }
    else if(isNaN(req.body.product_price)){
        res.send({'error' : 'product_price wajib diisi dengan angka'})
    }
    next()
})

app.put('/api/product/:id', myLog, function(req, res, next){
    let data = {product_name : req.body.product_name, product_price : req.body.product_price}
    if(req.body.product_price <= 0){
        res.send({'error': 'product_price tidak boleh <= 0'})
    }
    else if(isNaN(req.body.product_price)){
        res.send({'error' : 'product_price wajib diisi dengan angka'})
    }
    next()
});

app.delete('/api/product/:id', myLog, function(req, res, next){
    next()
})

app.listen(port, () => {
    console.log(`Server running at ${hostname}:${port}`);
})