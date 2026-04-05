const nodemailer=require("nodemailer");
module.exports.sendMail=(email,subject,html)=>{

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: 'lamn50478@gmail.com',
      pass: process.env.PASSWORD_EMAIL
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  var mailOptions = {
    from: 'lamn50478@gmail.com',
    to: email,
    subject: subject,
    html:html
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

