const mongoose = require('mongoose')

const errorHandler = (err, req, res, next) => {
    let error = err;
    
    const response = {
        ...error,
        message: error.message,
    }

    return res
    .status(error.statusCode)
    .json(response);
}

module.exports = {errorHandler}