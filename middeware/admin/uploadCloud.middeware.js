// //cloudinary
// require('dotenv').config();
// const cloudinary=require('cloudinary').v2;
// const streamifier=require('streamifier');
// cloudinary.config({ 
//   cloud_name: process.env.CLOUD_NAME, 
//   api_key: process.env.CLOUD_KEY, 
//   api_secret: process.env.CLOUD_SECRET,
// });
// //end cloudinary
// console.log("Cloudinary config:", process.env.CLOUD_NAME, process.env.CLOUD_KEY, process.env.CLOUD_SECRET);


// module.exports.upload= (req, res, next)=> {  
//     if(req.file){
//         console.log("File nhận được:", req.file);

//         let streamUpload = (req) => {
//             return new Promise((resolve, reject) => {
//                 let stream = cloudinary.uploader.upload_stream(
//                 (error, result) => {
//                     if (result) {
//                     resolve(result);
//                     } else {
//                     reject(error);
//                     }
//                 }
//                 );

//             streamifier.createReadStream(req.file.buffer).pipe(stream);
//             });
//         };

//     async function upload(req) {
//         let result = await streamUpload(req);
//         req.body[req.file.fieldname]=result.url;
        
//         next();
//     }
//      upload(req);
//         }
//     else{
//          next();
//     }

// }
const uploadToCloudinary=require("../../helpers/uploadToCloudinary.helper");




module.exports.upload= async(req, res, next)=> {  
    if(req.file){
       
       try {
      const result = await uploadToCloudinary(req.file.buffer); // result là object trả về từ Cloudinary
      console.log("file nhan:", result);
      // nếu uploadToCloudinary trả về url string, lưu trực tiếp
      // nếu trả về object, dùng result.url hoặc result.secure_url
      req.body[req.file.fieldname] = result.url || result.secure_url || result;
    } catch (err) {
      console.error("Upload error:", err);
      // tùy xử lý: next(err) hoặc chỉ log và next()
    }
        }
    next();
}