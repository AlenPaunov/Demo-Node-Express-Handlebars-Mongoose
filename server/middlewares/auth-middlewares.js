import { ROLES } from '../constants.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { promisify }  from 'util';
const jwtVerify = promisify(jwt.verify);

export const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    User.findByToken(token)
        .then(user => {
            if (!user) {
                return Promise.reject();
            }

            req.user = user;
            res.token = token;
            next();
        })
        .catch(error => {
            res.status(401).send();
            next();
        });
}

export const auth = async (req, res, next) => {
    let token = req.cookies['session'];

    if (token) {
        try {
            let decodedToken = await jwtVerify(token, '53CR3T');
            console.log(decodedToken);
            req.user = decodedToken;
            res.locals.user = decodedToken;
        } catch (err) {
            console.log(err);
            return res.redirect('/404');
        }
    }

    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.user.roles.includes(ROLES.ADMIN)) {
        return next({
            statusCode: 401,
            message: 'Достъпът е отказан',
        });
    }
    next();
};

export const isAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/');
    }

    next();
};