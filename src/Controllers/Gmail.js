const fs = require('fs').promises;
const path = require('path');
const nodemailer=require('nodemailer')
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;


const client_id="441724442931-1o6gkh098q1epa2nh1h2efm88vcsbnsl.apps.googleusercontent.com"
const client_secret="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"
const redirect_uri="https://developers.google.com/oauthplayground/"
const refresh_token="1//04-Ed9fzb4LavCgYIARAAGAQSNwF-L9Ir7HQqEmmufFju23XzqoruCMwntVSwYbI0Z82nBzf2ran9j1ptAYarRIMy04yTuc4jXd4"
const user='latienditaax@gmail.com'

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