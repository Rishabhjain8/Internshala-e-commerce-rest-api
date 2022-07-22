const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const fetchuser = require('../middleware/fetchuser');

router.post('/addproduct',fetchuser, async (req, res) => {
    try{
        let {name, price} = req.body;

        let product = await Product.create({
            name,
            price,
            user: req.user.id
        });

        res.json({message: "Product has been added successfully", product});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

router.get('/getproduct/:id', fetchuser, async (req, res) => {
    try{
        let product = await Product.findById(req.params.id);

        res.json({product});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

router.get('/getproduct', async (req, res) => {
    try{
        let products = await Product.find();
        res.json({products});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

router.post('/updateproduct/:id', fetchuser, async (req, res) => {
    try{
        const {name, price} = req.body;
        const newProduct = {};
        if(name){
            newProduct.name = name;
        }
        if(price){
            newProduct.price = price;
        }

        let product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).send("Not found");
        }

        if(product.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        product = await Product.findByIdAndUpdate(req.params.id, { $set: newProduct }, { new: true })
        res.json({ product });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

router.post('/deleteproduct/:id', fetchuser, async (req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json({message: "Product has been deleted successfully", product});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
  