const Todo = require('./todo.model');

require('./mongo').connect();

function getTodos(req, res) {
  const docquery = Todo.find({});
  docquery
    .exec()
    .then(todos => {
      res.status(200).json(todos);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function postTodo(req, res) {
  const originalTodo = { name: req.body.name };
  const todo = new Todo(originalTodo);
  todo.save({ upsert: true }, error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(todo);
    console.log('Todo created successfully!');
  });
}

function putTodo(req, res) {
  const originalTodo = {
    _id: req.body._id,
    name: req.body.name
  };
  Todo.findOne({ _id: originalTodo._id }, (error, todo) => {
    if (checkServerError(res, error)) return;
    if (!checkFound(res, todo)) return;

    todo.name = originalTodo.name;
    todo.saying = originalTodo.saying;
    todo.save(error => {
      if (checkServerError(res, error)) return;
      res.status(200).json(todo);
      console.log('Todo updated successfully!');
    });
  });
}

function deleteTodo(req, res) {
  Todo.findOneAndRemove({ _id: req.params.id })
    .then(todo => {
      if (!checkFound(res, todo)) return;
      res.status(200).json(todo);
      console.log('Todo deleted successfully!');
    })
    .catch(error => {
      if (checkServerError(res, error)) return;
    });
}

function checkFound(res, hero) {
  if (!hero) {
    res.status(404).send('Todo not found.');
    return;
  }
  return hero;
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

module.exports = {
  getTodos,
  postTodo,
  putTodo,
  deleteTodo
};