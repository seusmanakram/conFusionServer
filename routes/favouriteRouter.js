const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favourite = require('../models/favourites');
const Dishes = require('../models/dishes');
const User = require('../models/user');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourite.findOne({ user: req.user._id })
            .populate('user dishes')
            .then((result) => {
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            })
            .catch((err) => {
                next(err);
            })
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {


        let favDishes = req.body;
        Favourite.findOne({ user: req.user._id })
            .then((result) => {
                if (result == null) {

                    // Store a new document for the current user
                    Favourite.create({
                        user: req.user._id,
                        dishes: req.body
                    })
                        .then((result) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(result);
                        }, (err) => next(err)).catch((err) => next(err));

                } else {

                    // Pushing the new dishes to the favourites collection
                    Favourite.findOneAndUpdate({ user: req.user._id }, {
                        $addToSet: {
                            dishes: favDishes
                        }
                    }).then((result) => {
                        console.log('After Update' + result);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result);

                    }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }).catch((err) => next(err));

    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.send('PUT operation not supported on ' + req.baseUrl);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favourite.findOne({ user: req.user._id })
            .then((dishes) => {
                console.log('Response' + dishes);
                if (dishes !== null) {
                    Favourite.findOneAndRemove({ user: req.user._id }).then((result) => {
                        res.statusCode = 200;
                        res.json(result);
                    }, (err) => next(err))
                        .catch((err) => next(err));
                } else {
                    res.statusCode = 404;
                    res.send('No dishes found for this user!');
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })




favouriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.send('GET operation not supported on ' + req.baseUrl);
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.send('PUT operation not supported on ' + req.baseUrl);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        let favDish = req.params.dishId;
        Favourite.findOne({ user: req.user._id })
            .then((result) => {
                if (result == null) {

                    // Store a new document for the current user
                    Favourite.create({
                        user: req.user._id,
                        dishes: req.params.dishId
                    })
                        .then((result) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(result);
                        }, (err) => next(err)).catch((err) => next(err));
                } else {

                    // Pushing the new dishes to the favourites collection
                    Favourite.findOneAndUpdate({ user: req.user._id }, {
                        $addToSet: {
                            dishes: favDish
                        }
                    }).then((result) => {
                        console.log('After Update' + result);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(result);
                        res.send(favDish + 'has been added to your favorite dishes\' collection!')
                    }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }).catch((err) => next(err));


    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favourite.findOne({ user: req.user._id })
            .then((result) => {
                console.log('Response' + result.dishes);
                console.log('Response' + req.params.dishId);

                if (result.dishes !== null) {
                    Favourite.findOneAndRemove({ dishes: req.params.dishId }).then((result) => {
                        res.statusCode = 200;
                        res.json(result);
                    }, (err) => next(err))
                        .catch((err) => next(err));
                } else {
                    res.statusCode = 404;
                    res.send('No dishes found for this user!');
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })


module.exports = favouriteRouter
