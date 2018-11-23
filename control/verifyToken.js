const jwt = require('jsonwebtoken');
const User = require('../models/user');

function verifyToken(req, res) {
    const token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({ message: 'No token' });
    jwt.verify(token, 'secret', function(err, decoded) {
        if (err)
            return res.status(500).send({message: 'Failed to authenticate token.' });
        User.findById(decoded.id, (err, user) => {
            if (err) return res.status(500).send('Error on the server.');
            if (!user) return res.status(404).send('No user found.');
            req.user = user;
           
        });
    });
}
module.exports = verifyToken;