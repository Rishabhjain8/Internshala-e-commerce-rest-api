const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'Itmykartisagreat$organisation';

router.post('/signup', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let success = false;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }

    success = true;
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }


});

router.post('/updateuser/:id', fetchuser, async (req, res) => {
    try{
        const {name, email} = req.body;
        const newUser = {};
        if(name){
            newUser.name = name;
        }
        if(email){
            let emailUser = await User.findOne({email: req.user.email});
            if(emailUser){
                return res.status(400).json({ error: "Sorry a user with this email already exists" });
            }

            newUser.email = email;
        }

        let user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).send("Not found");
        }

        if(user.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        user = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true })
        res.json({ user });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
})

router.get('/getuser', fetchuser,  async (req, res) => {
  try {
    let userId = req.user.id;
    let user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/deleteuser/:id',fetchuser, async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({message: "User is deleted successfully", user});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;