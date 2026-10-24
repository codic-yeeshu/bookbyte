const { Router } = require("express");

const newsletterRouter = Router();

// controller functions
const { subscribe, unsubscribe } = require("../controllers/newsletter");

newsletterRouter.post("/subscribe", subscribe);
newsletterRouter.post("/unsubscribe", unsubscribe);

module.exports = { newsletterRouter };
