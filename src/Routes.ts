import express from "express";
import { controllers as UserController } from "./auth";

const Routes = async (router: express.Router) => {

	//user
	router.post("/signup/register", UserController.signup);
	router.post("/login", UserController.login);

};

export { Routes };