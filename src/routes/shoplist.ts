// core imports
import express from 'express';
// const express = require('express');

// my imports
import { getUserLists, createShoplist, updateShoplist, deleteShoplist, getReport } from '../controllers/shoplist';

// Auth middleware
import isAuth from '../middleware/is-auth';

const router: any = express.Router();

// shoplist routes
router.get('/', isAuth, getUserLists);
router.post('/createshoplist', isAuth, createShoplist);
router.post('/updateshoplist/:shoplistId', isAuth, updateShoplist);
router.delete('/deleteshoplist/:shoplistId', isAuth, deleteShoplist);
router.post('/report', isAuth, getReport);

module.exports = router;