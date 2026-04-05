const Setting=require("../../models/setting.model");
module.exports.Setting=async (req,res,next)=>{
    const SettingGeneral=await Setting.findOne({});
    res.locals.SettingGeneral=SettingGeneral;
   
    
    
    next();
}