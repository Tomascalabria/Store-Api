var express = require('express');
const database = require('../Models/db_config');
var router = express.Router();

//Retrieve all existing products in the database
router.get('/', async (req, res) => {
 try{

     let products = await database.query('SELECT * FROM products INNER JOIN inventory on inventory.product_id = products.product_id inner join categories on categories.category_id=products.product_category;')
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
    try{
    let product = await database.query(`SELECT * FROM categories inner join products as p ON p.product_category=categories.category_id INNER JOIN inventory as i ON i.product_id=p.product_id WHERE p.product_id=$1;`,[req.params.id])    
    res.status(200).json({
        message:'Producto encontrado satisfactoriamente',
        data:product.rows[0],
        status:200  
    })
console.log(product.rows)
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