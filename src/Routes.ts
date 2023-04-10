import express from "express";
import swaggerUi from 'swagger-ui-express'

import swaggerDocument from './swagger.json'
import UserController from "./user/controllers/user.controller";


const Routes = async (router: express.Router) => {
	router.use('/', swaggerUi.serve);
	router.get('/', swaggerUi.setup(swaggerDocument));

	//user
	router.post("/signup/register", UserController.signup);
	router.post("/login", UserController.login);

};

export { Routes };