
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/chat.controller');


//[GET] /chat
router.get("/",controller.index);


module.exports = router;