import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {

    const accessToken = authHeader.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send({ error: 'Your session has expired. Please log in again.' });
        } else {
            req.userId = decoded.id;
            next();
        }
    });
}