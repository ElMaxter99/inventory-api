const { Router } = require("express");
const { listUserZones } = require("../controllers/zone.controller");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.get("/me", requireAuth, listUserZones);

module.exports = router;
