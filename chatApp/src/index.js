import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './lib/dbInit';
import middleware from './middleware';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import { Router } from "express";

// import api from './api';
import config from './config.json';
import { initializeChatSocket } from './lib/sockets/chatSocket';
import { UserRoutes } from './api/userRoutes';

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(express.static('public'));

// connect to db
initializeDb(db => {
	let router = Router();

	// internal middleware
	app.use(middleware({ config, db }));

	app.get('/', (req, res) => {
		res.sendFile(`${__dirname}/index.html`);
	});

	// Initialize chat socket
	initializeChatSocket(io);
	router.use(
		"/user",
		UserRoutes({ router })
	  );


	// api router
	// app.use('/api', api({ config, db }));

	server.listen(process.env.PORT || config.port, () => {
		console.log(`Server listening on port ${process.env.PORT || config.port}`);
	});
});

export default app;


