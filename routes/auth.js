const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');



router.post('/register', async (req, res) => {
  //VALIDATE incoming data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user already exist in the DB
  const emailExist = await User.findOne({email: req.body.email});
  if (emailExist) return res.status(400).send('Email already exists');

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //If all validations passed, register new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send({user: user._id});
  }
  catch (err) {
    res.status(400).send(err);
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  //VALIDATE incoming data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if the user exists in the DB
  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send('Emailll or password is wrong');

  //Check if user's password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  
  //If user authentication passed, login the user
  if (!validPass) return res.status(400).send('Email or passworddd is wrong');

  //Create and assign a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
  // res.send('Logged in!');
  
});

module.exports = router;