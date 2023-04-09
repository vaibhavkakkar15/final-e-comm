const express =  require('express');
// const Joi = require('joi');
const Product = require('../models/product');
const router = express.Router();
const {validateProduct} =  require('../middleware');

// displaying all the products
router.get('/products' , async(req,res)=>{
    try{
        let products = await Product.find({});
        res.render('products/index' , {products});
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
    
})


// adding a fomr for  anew product
router.get('/products/new' , (req,res)=>{
    try{
        res.render('products/new');
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

// actually adding a product in a DB 
router.post('/products' , validateProduct , async (req,res)=>{
    // try{
        let {name,img,price,desc} = req.body;
        
        // server side validation switched to schema.js
        // const productSchema = Joi.object({
        //     name: Joi.string().required(),
        //     img: Joi.string().required(),
        //     price: Joi.number().min(0).required(),
        //     desc: Joi.string().required()
        // });
        // const {error} = productSchema.validate({name,img,price,desc});
        // console.log(error);

        await Product.create({name,img,price,desc});
        res.redirect('/products');
    // }

    // catch(e){
    //     res.status(500).render('error' , {err:e.message});
    // }
})

// route for shwoing the deatails of thre products
router.get('/products/:id' , async(req,res)=>{
    try{

        let {id} = req.params;
        // let foundProduct = await Product.findById(id);
        let foundProduct = await Product.findById(id).populate('reviews');
        // console.log(foundProduct);
        res.render('products/show' , {foundProduct});
    }

    catch(e){
        res.status(500).render('error' , {err:e.message});
    }

})

// route for editing the product so we need form for it
router.get('/products/:id/edit' , async(req,res)=>{
    try{

        let {id} = req.params;
        let foundProduct = await Product.findById(id);
        res.render('products/edit' , {foundProduct});
        
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

// changing the original edits in the database made in the editform 
router.patch('/products/:id', validateProduct, async(req,res)=>{
    try{

        let {id} = req.params;
        let {name,img,price,desc} = req.body;
        await Product.findByIdAndUpdate(id , {name,img,price,desc});
        res.redirect(`/products/${id}`)
    }

    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

//delete a route
router.delete('/products/:id' , async(req,res)=>{
    try{

        let {id} = req.params;
        // const product = await Product.findById(id);
        
        // for(let id of product.reviews){
        //     await Review.findByIdAndDelete(id);
        // }
        
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    }

    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})



module.exports = router;