const express = require("express");
const mongoose = require("mongoose");
const customerRouter = express.Router();

const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: { type: String },
  address: { type: String },
  group: { type: Number },
  phno: { type: String, maxlength: 10 },
});

const Customer = mongoose.model("Customer", customerSchema);

// Create a new customer
customerRouter.post("/customer", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const response = await customer.save();
    res.status(201).json({
      message: "Customer created successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(400).json({
      message: "Error creating customer",
      error: error.message,
    });
  }
});

// Retrieve all customers
customerRouter.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({
      message: "Customers retrieved successfully",
      data: customers,
    });
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({
      message: "Error retrieving customers",
      error: error.message,
    });
  }
});

// Retrieve a single customer by id
customerRouter.get("/customer/:id", async (req, res) => {
  try {
    const customer = await Customer.findOne({ id: req.params.id });
    if (customer) {
      res.status(200).json({
        message: "Customer retrieved successfully",
        data: customer,
      });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).json({
      message: "Error retrieving customer",
      error: error.message,
    });
  }
});

customerRouter.get("/", (req, res) => {
  res.json("Hello");
});

// Update a customer by id
customerRouter.put("/customer", async (req, res) => {
  try {
    // Filter out undefined fields from the request body
    const updateData = Object.keys(req.body).reduce((acc, key) => {
      if (
        req.body[key] !== "" ||
        req.body[key] !== null ||
        req.body[key] !== undefined
      ) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    const customer = await Customer.findOneAndUpdate(
      { id: req.body.id },
      updateData,
      { new: true } // This option returns the updated document
    );

    if (customer) {
      res.status(200).json({
        message: "Customer updated successfully",
        data: customer,
      });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(400).json({
      message: "Error updating customer",
      error: error.message,
    });
  }
});

// Delete a customer by id
customerRouter.delete("/customer/:id", async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ id: req.params.id });
    if (customer) {
      res.status(200).json({ message: "Customer deleted successfully" });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({
      message: "Error deleting customer",
      error: error.message,
    });
  }
});

module.exports = customerRouter;
