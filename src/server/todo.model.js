const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    name: String
  },
  {
    collection: 'Todos',
    versionKey: false
  }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;