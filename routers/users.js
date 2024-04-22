const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' })
    }
    res.status(200).send(user);
})

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.put('/:id', async (req, res) => {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true }
    )

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})




router.post('/login', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            console.log('User not found');
            return res.status(400).send('The user not found');
        }

        const enteredPassword = req.body.password.trim();
        const passwordMatch = bcrypt.compareSync(enteredPassword, user.passwordHash);

        if (passwordMatch) {
            const token = jwt.sign(
                {
                    name: user.name,
                    email: user.email,
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                process.env.secret,
                { expiresIn: '7d' }
            );

            res.status(200).send({ name: user.name, user: user.email, token: token, isAdmin: user.isAdmin });
        } else {
            res.status(400).send('Password is wrong!');
        }

    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});




router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})


router.delete('/:id', (req, res) => {

    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'the user is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "user not found!" })
        }
    })
        .catch(err => {
            return res.status(500).json({ success: false, error: err })
        })

})

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count) => count)

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        userCount: userCount
    });
})


module.exports = router;