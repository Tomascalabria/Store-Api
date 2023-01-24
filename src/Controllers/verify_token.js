
const jwt=require('jsonwebtoken')

const verifyToken=async(req,res,next)=>{
    const authHeader=req.headers.token
    if(authHeader){
    const token=authHeader
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            console.log(user)
            if(err){
             res.status(403).json('sorry your token has expire. Please enter again')
            
            }
            else{
                req.user=user    
                next()
            }
        })  
    }
    else{
        return res.status(401).json('You must authenticate')
    }
}

const verifyAuthorization=(req,res,next)=>{
verifyToken(req,res,()=>{
    if (req.user.id===req.params.id||req.user.isAdmin){
        next()
    }
    else{
        res.status(403).json('You must be an admin for that operation' )
    }
})
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
}
module.exports={verifyToken,verifyAuthorization,verifyAdmin}