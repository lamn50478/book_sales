//cloudinary
require('dotenv').config();
const cloudinary=require('cloudinary').v2;
const streamifier=require('streamifier');
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET,
});
//end cloudinary
console.log("Cloudinary config:", process.env.CLOUD_NAME, process.env.CLOUD_KEY, process.env.CLOUD_SECRET);

//Ham stream upload
  let streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                    resolve(result);
                    } else {
                    reject(error);
                    }
                }
                );

            streamifier.createReadStream(buffer).pipe(stream);
            });
        };
//Ham stream upload
//Ham upload to cloudinary
module.exports=async(buffer)=> {
        let result = await streamUpload(buffer);
        return result.url;
   
    }
//end Ham upload to cloudinary