import express from "express";
import UserController from "./user/controllers/user.controllers";


const Routes = async (router: express.Router) => {
	//user
	router.post("/signup/register", UserController.signup);
	router.post("/login", UserController.login);

};

export { Routes };