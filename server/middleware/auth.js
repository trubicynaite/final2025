import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'Authorization header missing.' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send({ error: 'Invalid or expired token.' });
        } else {
            req.userId = decoded._id;
            next();
        }
    });
}