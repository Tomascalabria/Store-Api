const fs = require('fs').promises;
const path = require('path');
const nodemailer=require('nodemailer')
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;


const user= process.env.user 
const client_id= process.env.client_id
const client_secret= process.env.client_secret
const refresh_token= process.env.refresh_token
const redirect_uri=process.env.redirect_uri

const oauthClient=new OAuth2(client_id,client_secret,redirect_uri)
oauthClient.setCredentials({refresh_token:refresh_token})
const accessToken= oauthClient.getAccessToken()

const sendEmail=async(receiver,subject,body)=>{
  try{

    const transport=nodemailer.createTransport({
    service:'gmail',
    auth: {
      type: "OAuth2",
      user: user, 
      clientId: client_id,
      clientSecret: client_secret,
      refreshToken: refresh_token,
      accessToken: accessToken
 },
 tls: {
  rejectUnauthorized: false
}

  })
  const mailOptions={
    from:'latienditaax@gmail.com',
    to:receiver,
    subject:subject,
    generateTextFromHTML: true,
    html:body,

  }
  const result=await transport.sendMail(mailOptions)
  return result
}
catch(err){
  return err
}
}



module.exports={sendEmail}