// //insert a new todo
// app.post('/todos', (req, res) => {
//     console.log(req.body);

//     var todo = new Todos({
//         text: req.body.text
//     });

//     todo.save().then((doc) => {
//         res.status(200);
//     }).catch((err) => {
//         res.status(400);
//     });
// });

// //fetch all todo
// app.get('/todos', (req, res) => {
//     Todos.find().then((todos) => {
//         res.send({
//             todos
//         });
//     }).catch((err) => {
//         res.status(400).send(err);
//     });
// });

// //fetch single todo
// app.get('/todos/:id', (req, res) => {
//     let id = req.params.id;
//     if (!ObjectID.isValid(id)) {
//         return res.status(404).send();
//     }
//     Todos.findById({
//         _id: id
//     }).then((todo) => {
//         if (!todo) return res.status(404).send();
//         res.send({
//             todo
//         });
//     }).catch((err) => {
//         return res.status(400).send();
//     });
// });

// //delete todo
// app.delete('/todos/:id', (req, res) => {
//     let id = req.params.id;
//     if (!ObjectID.isValid(id)) return res.status(404).send();
//     Todos.findByIdAndRemove(id).then((todo) => {
//         if (!todo) return res.status(404).send();
//         res.status(200).send();
//     }).catch(err => {
//         return res.status(400).send();
//     });
// });

// //update todo
// app.patch('/todos/:id', (req, res) => {
//     var id = req.params.id;
//     var body = _.pick(req.body, ['text', 'isCompleted']);

//     if (!ObjectID.isValid(id)) return res.status(404).send();

//     if (_.isBoolean(body.isCompleted) && body.isCompleted) {
//         body.completedAt = new Date().getTime();
//     } else {
//         body.isCompleted = false;
//         body.completedAt = null;
//     }
//     Todos.findByIdAndUpdate(id, {
//         $set: body
//     }, {
//         new: true
//     }).then((todo) => {
//         if (!todo) return res.status(404).send();
//         res.send({
//             todo
//         });
//     }).catch((err) => {
//         return res.status(400).send();
//     });
// });