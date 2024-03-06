const mongoose = require('mongoose');

const Order = require('../models/order');

exports.getAllOrders = (request, response, next) => 
{
    Order.find()
        .select('productId quantity _id')
        .populate('productId')
        .exec()
        .then(docs => 
        {
            response.status(200).json(
            {
                count: docs.length,
                orders: docs.map(doc => 
                {
                    return {
                        _id: doc._id,
                        productId: doc.productId,
                        quantity: doc.quantity,
                        request: 
                        {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(error => 
        {
            response.status(500).json(
            {
                error: error
            });
        });
};

exports.createOrder = (request, response, next) => 
{
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        productId: request.body.productId,
        quantity: request.body.quantity,
    });

    order.save()
        .then(result => 
        {
            console.log(result);
            response.status(201).json(result);
        })
        .catch(error => 
        {
            console.log(error);

            response.status(500).json(
            {
                error: error
            })
        });
};

exports.getSingleOrder = (request, response, next) => 
{
    Order.findById(request.params.orderId)
        .populate('productId')
        .exec()
        .then(order => 
        {
            if (!order)
            {
                return response.status(404).json(
                {
                    message: 'Order not found'
                });
            }

            response.status(200).json(
            {
                order: order,
                request: 
                {
                    type: 'GET',
                    url: 'http://localhost:3000/orders' + order._id
                }
            })
        })
        .catch(error => 
        {
            response.status(500).json(
            {
                error: error
            })
        });
};

exports.deleteOrder = (request, response, next) => 
{
    Order.deleteOne({ _id: request.params.orderId }).exec()
        .then(() => 
        {
            response.status(200).json(
            {
                message: 'Order deleted',
                request: 
                {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(error => 
        {
            response.status(500).json(
            {
                error: error
            })
        });
};
