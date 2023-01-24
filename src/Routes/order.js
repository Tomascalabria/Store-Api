var express = require('express');
const database = require('../Models/db_config');
var router = express.Router();

router.get('/order/:order_number', async (req, res) => {
    let order_number = req.params.order_number;
  
    try {
      let order = await database.query('SELECT * FROM orders WHERE order_id = $1', [order_number]);
      if (order.rowCount === 0) {
        return res.status(404).json({
          message: 'La orden no existe',
          status: 404
        });
      }
      res.status(200).json({
        payload: order.rows,
        message: 'La orden ha sido encontrada con éxito',
        status: 200
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Error al buscar la orden',
        status: 500
      });
    }
  });
  

  router.post('/create_order', async (req, res) => {
    let order = req.body;
  
    try {
      let newOrder = await database.query('INSERT INTO orders (customer_id, order_date, total_amount) VALUES ($1, $2, $3)', [order.customer_id, order.order_date, order.status]);
      res.status(201).json({
        data: newOrder,
        message: 'La orden ha sido creada con éxito',
        status: 201
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Error al crear la orden',
        status: 500
      });
    }
  });
  