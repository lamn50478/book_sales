
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/seach.controller');


router.get("/",controller.search);

module.exports = router;
