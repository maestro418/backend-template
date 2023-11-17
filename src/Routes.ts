import express from "express";
import controllers, { updator } from "./controllers";

// run update service
updator();

const Routes = (router: express.Router) => {
	router.post("/newOrder", controllers.newOrder);
	router.get("/customers", controllers.getCustomers);
	router.get("/tier", controllers.getTier);
	router.get("/orders", controllers.getOrders);
};

export default Routes;