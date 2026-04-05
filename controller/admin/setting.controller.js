const Setting=require("../../models/setting.model.js");
const systemConfig=require("../../config/system.js");
module.exports.general=async (req,res)=>{
    const SettingGeneral=await Setting.findOne({});

      res.render("admin/pages/setting/general.pug",{
        pageTitle:"Cai dat chung",
        SettingGeneral:SettingGeneral
   })
}
module.exports.generalPatch=async (req,res)=>{
   console.log('req.file:', req.file);        // bạn đã có buffer — OK
console.log('req.body after uploadCloud:', req.body); // uploadCloud có gán url không?
console.log('req.fileUrl:', req.fileUrl);  // nếu uploadCloud gán ở đây

     let SettingGeneral=await Setting.findOne({

     });
     if(SettingGeneral){
        await SettingGeneral.updateOne({
            _id:SettingGeneral.id
        },req.body);
     }
     else{
        SettingGeneral=new Setting(req.body);
   
        await SettingGeneral.save();
     }
    
   req.flash("success","Chinh sua cai dat thanh cong!");
   res.redirect("/admin/setting/general");
}