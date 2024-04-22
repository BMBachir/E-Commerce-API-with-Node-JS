const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

//API's

router.get('/', async (req, res) => {

    let filter = {};
    //[req.query.categories] adii tji information mn 3and l user 
    if (req.query.categories) {
        filter = { categories: req.query.categories.split(",") }
    }
    //populate chghol tafichilk category mfwest product
    const productsList = await Product.find(filter).populate('category')
    res.send(productsList)

})

router.get('/:id', async (req, res) => {
    // adi isvalidId bch tchouf ila existe ID ada wela la
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.send('The ID is not Valid')
    }

    const product = Product.findById(req.params.id)
    if (!product) {
        res.status(400).send('The Product Not Found')
    }
    res.send(product)
})
////////////////////////////////////////////////////////////////////////////////////////////

router.get('/get/count', async (req, res) => {

    const productCount = await Product.countDocuments();

    if (productCount === 0) {
        res.status(400).send('There is no product!');
    } else {
        res.send(productCount.toString());
    }

})

/////////////////////////////////////////////////////////////////////////////////////////

router.get('/get/featured', async (req, res) => {

    const productFeatrud = await Product.find({ isFeatured: true })

    if (!productFeatrud) {
        res.status(400).send('There is no featured Products!!')
    }
    res.send(productFeatrud)
})

//////////////////////////////////////////////////////////////////////////////////////////
router.post(`/`, async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if (!product)
        return res.status(500).send('The product cannot be created')

    res.send(product);
})

////////////////////////////////////////////////////////////////////////

router.put('/:id', async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        res.send('The ID is not Valid')
    }

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(

        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true },

    )

    if (!product) {
        return res.status(400).send('the category cannot be Updated!')
    }

    res.send(product)
});

///////////////////////////////////////////////////////////////////////

router.delete('/:id', async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        res.send('The ID is not Valid')
    }

    const product = await Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).send('The Product Has Been Deleted Succesfuly!!')
        }
        else {
            return res.status(200).send('The Product Not Found!!')
        }


    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })

});

module.exports = router;


/* ANOTHER WAY TO SAVE 
 
    product.save()
 
        .then((createdProduct => {
            res.status(200).json(createdProduct)
        }))
 
        .catch((err) => {
            res.status(404).json({
                error: err,
                success: false
            })
 
        })*/



