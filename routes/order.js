const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const fetchuser = require('../middleware/fetchuser');

router.get('/getorder', fetchuser, async (req, res) => {
    try{
        let orders = await Order.find().populate('product');

        // let orders = order.filter(ord => console.log(req.user.id + " " + ord.product.user));
        
        // req.user.id === ord.product.user
        let price = 0;

        for(let i = 0;i < orders.length;i++){
            price += orders[i].product.price;
        }

        res.json({orders, price});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

router.post("/addorder", fetchuser,async  (req, res) => {
    try{
        let product = await Product.findById(req.body.product) ;                //id is product id
    if (!product) {
        return res.status(404).json({ message: "Product not found"});
      }

      let order = await Order.create({
        quantity: req.body.quantity,
        product: req.body.product,
        user: req.user.id
      });

      res.json({message: "Order has been added successfully", order});
    }
    
      catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
  });

router.get('/getorder/:id', async (req, res) => {
    try{
        let order = await Order.findById(req.params.id).populate('product');
        let price = order.product.price;

        res.json({order, price});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

router.post('/updateorder/:id', fetchuser, async (req, res) => {
    try{
        const {products, quantity} = req.body;
        const newOrder = {};
        if(products){
            newOrder.products = products;
        }
        if(quantity){
            newOrder.quantity = quantity;
        }

        let order = await Order.findById(req.params.id).populate('product');
        if(!order){
            return res.status(404).send("Not found");
        }

        if(order.product.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        order = await Order.findByIdAndUpdate(req.params.id, { $set: newOrder }, { new: true })
        res.json({ order });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

router.post('/deleteorder/:id', fetchuser, async (req, res) => {
    try{
        const order = await Order.findByIdAndDelete(req.params.id);
        res.json({message: "Order has been deleted successfully", order});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;