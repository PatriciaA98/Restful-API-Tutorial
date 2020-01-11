const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    //defnes where the incoming files should be
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        const now = new Date().toISOString();
        const date = now.replace(/:/g,'-');
        cb(null, date + file.originalname);
       // cb(null, new Date.now() + file.orginalname);
    }
});

const fileFilter = function(req, file, cb){
    //rejects a file
    // if image is a 'jpeg' or 'png' we save it else we dont save it
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else{
        cb(null, false);
    } 
};

const upload = multer({
    storage: storage,
    limits: {
    fileSize: 1024 * 1024* 5 //sets the image size to 5 MB
    },
    fileFilter: fileFilter
});

//imports object product 
const Product = require('../models/product');

//displays all products in database
router.get('/', (req, res, next) => {
    Product.find()
    .select("name price productImage _id ")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc.id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                };
            })
        };
        if (docs.length >= 0) {
            res.status(200).json(response);
        }else {
            res.status(404).json({message: "No entries found"})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    
    
});

//creates/ post new products to the database
router.post('/', upload.single('productImage'), (req, res, next) => {
   // console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(200).json ({
            message: 'Created product sucessfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result.id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });
   
});

//display the product with the productID the user gives
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc =>{
        console.log("From database",doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/products'
                }
            });
        }
        else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
   
});

//Updates a given product
router.patch('/:productId',(req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:  id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated successfully',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.statusMessage(500).json({error: err});
    });
});

//deletes a given product
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
   Product.remove({_id: id})
   .exec()
   .then(result => {
       res.status(200).json({
          message: 'Product deleted',
          request: {
              type: 'POST',
              description: 'Create a new product ',
              url: 'http://localhost:3000/products',
              body: {name: 'String', price: 'Number'}
          } 
       });
   })
   .catch(err => {
       res.status(500).json({error: err});
   });
});
module.exports = router;