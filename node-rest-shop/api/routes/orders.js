const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');



//Displays all orders stored in database
router.get("/", checkAuth, OrdersController.orders_get_all);

//Creates a new order
router.post('/', checkAuth, OrdersController.orders_create_order);

//Displays a given order
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

//Deletes a given order
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;