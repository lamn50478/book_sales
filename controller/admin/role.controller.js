const Role=require("../../models/roles.model");
const systemConfig=require("../../config/system.js");
module.exports.index=async (req,res)=>{
    const find={
        deleted:false
    };
    const records=await Role.find(find);
    res.render("admin/pages/role/index.pug",{
        pageTitle:"Nhóm quyền",
        records:records
   })
}
module.exports.create=async (req,res)=>{
    const find={
        deleted:false
    };
    res.render("admin/pages/role/create.pug",{
        pageTitle:"Thêm nhóm quyền",
   })
}

module.exports.createPost=async (req,res)=>{
    console.log(req.body);
    const records=new Role(req.body);
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/role`)
}

module.exports.edit=async (req,res)=>{
  try{
        const id=req.params.id;
        const find={
            deleted:false,
            _id:id
        };
        const data=await Role.findOne(find)

        res.render("admin/pages/role/edit.pug",{
            pageTitle:"Chỉnh sửa nhóm quyền",
            data:data
    })
  }
  catch(error){
       res.redirect(`${systemConfig.prefixAdmin}/role`)
  }
}


module.exports.editPost=async (req,res)=>{
    try{
        const id=req.params.id;
        console.log(req.body);

        await Role.updateOne({_id:id},req.body);
        req.flash("success","Cập nhật nhóm quyền thành công")
        res.redirect(`${systemConfig.prefixAdmin}/role`)
    }
    catch(eror){
       res.redirect(`${systemConfig.prefixAdmin}/role`);
       req.flash("error","Cập nhật nhóm quyền thất bại!")
    }
}