const express= require('express')
const app=express()
const users= require('./Routes/Users')
const products=require('./Routes/Products')
const ejs = require("ejs");
const cors = require('cors')
const database = require('./Models/db_config')
const body_parser=require('body-parser')
const port=8080||process.env.PORT
app.use(body_parser.urlencoded({extended: false}));

app.use(cors())
app.set("view engine", "ejs");
app.use(body_parser.json());

app.use('/products',products)
app.use('/auth',users)
database.connect()
.then((res)=>{
    console.log('DB is connected')
})
.catch((err)=>{console.log(err)})
app.listen(port,()=>{
    console.log('Server is up in port',port)
    
})
