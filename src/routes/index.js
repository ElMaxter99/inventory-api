const { Router } = require("express");
const auth = require("./auth.routes");
const inventories = require("./inventories.routes");
const locators = require("./locators.routes");
const publicRoutes = require("./public.routes");
const userZones = require("./user-zones.routes");

const router = Router();

router.use("/auth", auth);
router.use("/inventories", inventories);
router.use("/locators", locators);
router.use("/public", publicRoutes);
router.use("/zones", userZones);

module.exports = { router };
