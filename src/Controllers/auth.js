const router= require('express').Router()
const CryptoJs= require('crypto-js')
const jwt=require('jsonwebtoken')
const path = require("path");
const ejs = require("ejs");
const database = require('../Models/db_config')
const { validateEmail } = require('./handlers')
const { verifyToken, verifyAuthorization } = require('./verify_token');
const { sendEmail } = require('./Gmail');


//Register      
router.post('/register', async (req, res) => {
  try {
    // Check that all inputs are completed
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res.status(404).json({error: 'All inputs must be completed'});
    }
    // Check that there are no existing users with the given username or email
    const existingUsername = await database.query('SELECT username FROM users where username=$1',[req.body.username.toLowerCase()]);
    const existingEmail = await database.query('SELECT email FROM users where email=$1',[req.body.email.toLowerCase()]);
    if (existingUsername.rowCount > 0 || existingEmail.rowCount > 0) {
      return res.status(401).json({message: 'Ya hay usuarios con estos datos',data:null,status:401});
    }
    // Email and password validation
    if(!validateEmail(req.body.email.toLowerCase())){
        return res.status(401).json({message:'Inserte un email valido',data:null,status:401});
    }
    if(req.body.password.length < 8){
        return res.status(401).json({message:'Lo sentimos la contraseña debe tener al menos 8 caracteres',data:null,status:401});
    }
    // Encrypt the password before saving the new user
    const secret = process.env.PASSWORD_SECRET; //secret key
    const encryptedPassword = CryptoJs.AES.encrypt(req.body.password, secret).toString();
    // Create a new user
    const newUser = await database.query(
      'INSERT INTO users (username, email, password, admin) VALUES ($1, $2, $3, $4)',
      [req.body.username.toLowerCase(), req.body.email.toLowerCase(), encryptedPassword, false]
    );
    // Save the new user to the database
    ejs.renderFile(path.join(__dirname+"/Mailing/Welcome.ejs"), {
      
      username: req.body.username,
    })
    .then(result => {
      sendEmail(req.body.email,`Bienvenido a la tiendita ${req.body.username.toUpperCase()}`,result ).
      then((res)=>{console.log(`New email welcome email sent! ${res}`)})
      .catch(err=>console.log(`Email could not be sent: ${err}`))
    }) 
    res.status(201).json({ message: 'Usuario creado con exito!',data:newUser.rows,status:200});
    console.log(`User created: ${req.body.username}`);
  } catch (err) {
    // Handle any errors that occur while saving the user
    console.log(err);
    res.status(500).json({error: 'An error occurred: ' + err});
  }

});

router.post('/login', async (req, res) => {
  // Find the user with the given email 
  const user = await database.query('SELECT * FROM users WHERE email = $1', [req.body.email]);

  // Return an error if the user doesn't exist
  if (user.rowCount === 0) {
      return res.status(401).json({ message: 'email o constraseña invalidos',data:null,status:401});
  }
  // Compare the passwords
  const secret = process.env.PASSWORD_SECRET; //secret key
  var bytes  = CryptoJs.AES.decrypt(user.rows[0].password, secret);
  var decryptedPassword = bytes.toString(CryptoJs.enc.Utf8);
  if(req.body.password !== decryptedPassword){
      return res.status(401).json({ message: 'email o constraseña invalidos',data:null,status:401});
  }
  // Generate an access token for the user and sets the expiration time of the JWT code in 3 days.
  const accessToken = jwt.sign({
      id: user.rows[0].id,
      admin: user.rows[0].isadmin
  }, process.env.JWT_SECRET, { expiresIn: '3d' });

  // Return the user's public data and the access token
  const publicData = Object.assign({}, user.rows[0], { password: undefined });
  res.status(200).json({ user_data: publicData, token: accessToken });
  console.log(`User logged in: ${publicData.username}`)
});

module.exports = router;


  