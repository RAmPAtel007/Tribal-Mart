module.exports = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.isJoi) {
        return res.status(400).json({
            message: 'Validation Error',
            details: err.details.map(d => d.message)
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Mongoose Validation Error',
            details: Object.values(err.errors).map(val => val.message)
        });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
};
