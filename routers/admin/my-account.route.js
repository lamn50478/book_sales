const express=require('express');
const router=express.Router();
const multer=require("multer");
// const storageMulter=require("../../helpers/storageMulter");
const upload=multer({}); //const upload=multer({storage:storageMulter()});
//end multer

const validate=require("../../validates/admin/products.validate.js");
const uploadCloud=require("../../middeware/admin/uploadCloud.middeware.js");
const myAccountController=require("../../controller/admin/my-account.controller");




router.get('/',myAccountController.index);
router.get('/edit',myAccountController.edit);
router.patch('/edit',
    upload.single("thumbnail"),
        uploadCloud.upload,
        myAccountController.editPatch);




module.exports=router