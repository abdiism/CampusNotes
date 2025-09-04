const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const protect = (req, res, next) => {
    console.log("--- PROTECT MIDDLEWARE ---");
    console.log("Request Headers:", JSON.stringify(req.headers, null, 2)); // Log all headers

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log("Authorization header found and starts with Bearer.");
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log("Token extracted:", token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token verified successfully. Decoded:", JSON.stringify(decoded, null, 2));
            req.user = decoded.user;
            next();
            return; // Important: exit after next()
        } catch (error) {
            console.error('Token verification failed. Error message:', error.message);
            console.error('Token that failed:', token); // Log the token that caused the error
            res.status(401).json({ status: 'Error', message: 'Not authorized, token failed' });
            return; // Important: exit after sending response
        }
    } else {
        console.log("Authorization header missing or does not start with Bearer.");
    }

    if (!token) {
        console.log("No token was processed or token was invalid, sending 'no token' response.");
        res.status(401).json({ status: 'Error', message: 'Not authorized, no token' });
        return; // Important: exit after sending response
    }
    // This part should ideally not be reached if the logic above is correct
    console.log("Fell through protect middleware logic - THIS SHOULD NOT HAPPEN");
};

module.exports = { protect };