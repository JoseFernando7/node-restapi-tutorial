const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAllProducts = (request, response, next) => 
{
    Product.find().select('name price _id').exec()
        .then(docs => 
        {
            const result = {
                count: docs.length,
                products: docs.map(doc => 
                {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }

            response.status(200).json(result);
        })
        .catch(error => 
        {
            console.log(error);
            response.status(500).json(
            {
                error: error
            });
        });
};

exports.createProduct = /*upload.single('productImage'),*/ (request, response, next) => 
{
    console.log(request.file);

    const product = new Product(
    {
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        price: request.body.price
    });

    product.save().then(result => 
    {
        console.log(result);

        response.status(201).json(
        {
            message: 'Handling POST requests to /products',
            createdProduct: result
        });
    })
    .catch(error => 
    {
        console.log(error)

        response.status(500).json(
        {
            error: error
        });
    });
};

exports.getSingleProduct = (request, response, next) => 
{
    const id = request.params.productId;

    Product.findById(id).exec()
        .then(doc =>
        {
            console.log(doc);
            
            if (doc)
            {
                response.status(200).json(doc);
            }
            else
            {
                response.status(404).json(
                {
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(error => 
        {
            console.log(error);
            response.status(500).json(
            {
                error: error
            });
        });
};

exports.updateProduct = (request, response, next) => 
{
    const id = request.params.productId;
    const updateOps = {};

    for (const ops of request.body)
    {
        updateOps[ops.propName] = ops.value;
    }

    Product.updateOne({ _id: id }, { $set: updateOps }).exec()
        .then(result => 
        {
            console.log(result);
            response.status(200).json(result);
        })
        .catch(error => 
        {
            console.log(error);
            response.status(500).json(
            {
                error: error
            }); 
        });
};

exports.deleteProduct = (request, response, next) => 
{
    const id = request.params.productId;

    Product.deleteOne({ _id: id }).exec()
        .then(result => 
        {
            response.status(200).json(result);
        })
        .catch(error => 
        {
            console.log(error);
            response.status(500).json(
            {
                error: error
            });
        });
};
