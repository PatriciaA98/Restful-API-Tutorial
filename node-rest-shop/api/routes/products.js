const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products.js');

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

//displays all products in database
router.get('/',ProductsController.products_get_all );

//creates/ post new products to the database
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

//display the product with the productID the user gives
router.get('/:productId', ProductsController.products_get_product);

//Updates a given product
router.patch('/:productId', checkAuth, ProductsController.products_update_product);

//deletes a given product
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);
module.exports = router;