const Customer = require('../models/Customer');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

//ADD NEW CUSTOMER
//REGISTER
router.post('/add', verifyToken, async (req, res) => {
  const newCustomer = new Customer({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    dateOfBirth: new Date(req.body.dateOfBirth).toDateString(),
    email: req.body.email,
    homeAddress: req.body.homeAddress,
    phoneNumber: req.body.phoneNumber,
    profilePicture: req.body.profilePicture,
    description: req.body.description,
  });

  try {
    const savedCustomer = await newCustomer.save();
    return res.status(201).json(savedCustomer);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE
router.put('/:id', verifyToken, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
    
  if (!customer) {
    return res.status(401).json('Customer not found!');
  }

  if (req.body.dateOfBirth) {
    req.body.dateOfBirth = new Date(req.body.dateOfBirth).toDateString();
  }

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedCustomer);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyToken, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
    
  if (!customer) {
    return res.status(401).json('Customer not found!');
  }

  try {
    await Customer.findByIdAndDelete(req.params.id);
    return res.status(200).json('Customer has been deleted...');
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET a Customer
router.get('/find/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(401).json('Customer not found!');
    }

    const { password, ...others } = customer._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL Customers
router.get('/', verifyToken, async (req, res) => {
  const query = req.query.new;
  try {
    const customers = query
      ? await Customer.find().sort({ _id: -1 }).limit(5)
      : await Customer.find();
    return res.status(200).json(customers);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
