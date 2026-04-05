const express=require("express");
const router=express.Router();
const settingController=require("../../controller/admin/setting.controller");
const multer=require("multer");
// const storageMulter=require("../../helpers/storageMulter");
const upload=multer({}); //const upload=multer({storage:storageMulter()});
//end multer
const productsController=require("../../controller/admin/products.controller");
const validate=require("../../validates/admin/products.validate.js");
const uploadCloud=require("../../middeware/admin/uploadCloud.middeware.js");

router.get("/general",settingController.general);
router.patch("/general",
    upload.single("logo"),
        uploadCloud.upload,
       
    settingController.generalPatch);




module.exports=router