const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//import order  and product objects
const Order = require('../models/order');
const Product = require('../models/product');

//Displays all orders stored in database
router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http:localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
    
});

//Creates a new order
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {//This error is not working!!!!
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(), //Order ID
            quantity: req.body.quantity,
            product: req.body.productId  //product ID
        });
       return order.save(); 
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url:'http:localhost:3000/orders/' + result._id
            }
        });
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
         });
      });  
});

//Displays a given order
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(order => {
        if(!order){
           return res.status(404).json({
               message:"Order not found"
           }) 
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url:'http://localhost:3000/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    
});

//Deletes a given order
router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message:"Order deleted",
            request: {
                type: "POST",
                desccription: "Create A New Order",
                url: "http://localhost:3000/orders",
                body: {productId: "ID", quantity: "Number"}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;