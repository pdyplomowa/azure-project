const express = require('express');
const router = express.Router();

let sequence = 0;

router.get('/todos', (req, res) => {
  res.status(200).json([]);
});

router.post('/todo', (req, res) => {
  req.body.id = ++sequence;
  res.status(200).json(req.body);
})

router.put('/todo', (req, res) => {
  res.status(200).json(req.body);
})

router.delete('/todo/:id', (req, res) => {
  res.status(200).json();
})

module.exports = router;