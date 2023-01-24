var express = require('express');
const database = require('../Models/db_config');
var router = express.Router();

//Retrieve all existing products in the database
router.get('/', async (req, res) => {
 try{

     let products = await database.query('SELECT * from products ')
     console.log('Products requested')
     res.status(200).json({
         message:'Productos encontrados satisfactoriamente',
         data:products.rows,
         status:200         
        })
    }
    catch(err){
        res.status(404).json({
            message:'Productos no encontrados',
            data:null,
            status:404        
        })
    }
    
    });

router.get('/:id',async(req,res)=>{
console.log(req.params.id)
    try{
    let product = await database.query(`SELECT * from products WHERE product_id=$1`,[req.params.id])    
    res.status(200).json({
        message:'Producto encontrado satisfactoriamente',
        data:product.rows,
        status:200
    })
}
catch(err){
    res.status(404).json({
        message:'Producto no encontrado',
        data:null,
        status:404        
    })
}
    
})

    module.exports = router;