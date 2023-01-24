const express = require('express');
const router = express.Router();
const auth =require('../Controllers/auth')
const {verifyToken,verifyAuthorization}=require('../Controllers/verify_token')

router.use(auth)


module.exports=router;