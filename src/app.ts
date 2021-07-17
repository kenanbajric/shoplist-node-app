import { NextFunction, Request, Response } from "express";

// core modules
const path = require('path');
const express = require('express');
const mongoose = require('mongoose'); 

// my imports
const authRoutes = require('./routes/auth');
const shoplistRoutes = require('./routes/shoplist');

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// parsing requests
app.use(express.json()); 

// routes
app.use('/auth', authRoutes);
app.use('/', shoplistRoutes); // this route needs to be last


//error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data })
})

// spinning up a server with database connection
mongoose
    .connect('mongodb+srv://johnny:1234@cluster0.awjuf.mongodb.net/shoplist?retryWrites=true&w=majority')
    .then(() => {
        app.listen(3000);
    })
    .catch((err: Error) => console.log(err));
