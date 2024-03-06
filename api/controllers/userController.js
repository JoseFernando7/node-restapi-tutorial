const User = require('../models/user');

exports.signupUser = (request, response, next) => 
{
    User.find({ email: request.body.email }).exec()
        .then(user => 
        {
            if (user.length >= 1)
            {
                return response.status(409).json(
                {
                    message: 'The mail provided already exists'
                });
            }
            else
            {
                bcrypt.hash(request.body.password, 10, (error, hash) =>
                {
                    if (error)
                    {
                        return response.status(500).json(
                        {
                            error: error
                        });
                    }
                    else
                    {
                        const user = new User(
                        {
                            _id: new mongoose.Types.ObjectId(),
                            email: request.body.email,
                            password: hash
                        });
            
                        user.save()
                            .then(result => {
                                response.status(201).json(
                                {
                                    message: 'User created',
                                    createdUser: result
                                });
                            })
                            .catch(error => 
                            {
                                response.status(500).json(
                                {
                                    error: error
                                });
                            });
                    }
                });
            }
        });
};

exports.loginUser = (request, response, next) => 
{
    User.find({ email: request.body.email }).exec()
    .then(user => {
        if (user.length < 1)
        {
            return response.status(401).json(
            {
                message: 'Auth failed'
            });
        }

        bcrypt.compare(request.body.password, user[0].password, (error, result) => 
        {
            if (error)
            {
                return response.status(401).json(
                {
                    message: 'Incorrect password'
                });
            }

            if (result)
            {
                const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });

                return response.status(200).json(
                {
                    message: 'Auth successful',
                    token: token,
                });
            }

            response.status(401).json(
            {
                message: 'Auth failed'
            });
        })
    })
    .catch(error => 
    {
        response.status(500).json(
        {
            error: error
        });
    });
};

exports.deleteUser = (request, response, next) =>
{
    User.deleteOne({ _id: request.params.userId }).exec()
        .then(() => 
        {
            response.status(200).json(
            {
                message: 'User deleted successfully'
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
