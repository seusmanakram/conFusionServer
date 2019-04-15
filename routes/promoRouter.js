const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const Promotions = require('../models/leaders');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());


promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((promotions) => {
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        Promotions.create(req.body)
            .then((promotion) => {
                console.log('Promotion created', promotion);
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promos');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        Promotions.remove({})
            .then((resp) => {
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promotion) => {
                console.log('Promotion created', promotion);
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        res.end('POST operation not supported on /promos/' +
            req.params.promoId);
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then((promotion) => {
                console.log('promotion created', promotion);
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((resp) => {
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });




module.exports = promoRouter;