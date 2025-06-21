import jwt from 'jsonwebtoken';

export const createAccessJWT = (newUser) => {
    return jwt.sign(newUser, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '10s'
    });
}

export const createRefreshJWT = (newUser) => {
    return jwt.sign(newUser, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '1m'
    });
}

export const validateJWT = (provided_JWT) => {
    let response;
    jwt.verify(provided_JWT, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            response = { error: 'Your session has expired. Please log in again.' }
        } else {
            response = decoded;
        }
    });
    return response;
}

