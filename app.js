const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {
    SHA512
} = require('crypto-js');
const jwt = require('jsonwebtoken');
const {
    tokenAuth
} = require('./models/data/tokenAuth.js');
var {
    mongoose
} = require('./models/config/mongoose.js');
var {
    User
} = require('./models/user.js');
var {
    Todo
} = require('./models/todo.js');
var {
    ObjectID
} = require('mongodb');
var app = express();
app.use(bodyParser.json());


//insert a new todo
app.post('/todos', tokenAuth, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _createdBy: req.user._id
    });
    todo.save().then((doc) => {
        res.status(200).send();
    }).catch((err) => {
        res.status(400).send();
    });
});

//fetch all todo
app.get('/todos', tokenAuth, (req, res) => {
    Todo.find({
        _createdBy: req.user._id
    }).then((todos) => {
        res.send({
            todos
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

//fetch single todo
app.get('/todos/:id', tokenAuth, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _createdBy: req.user._id
    }).then((todo) => {
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    }).catch((err) => {
        return res.status(400).send();
    });
});

//delete todo
app.delete('/todos/:id', tokenAuth, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    Todo.findOneAndRemove({
        _id: id,
        _createdBy: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send();
    }).catch(err => {
        return res.status(400).send();
    });
});

//update todo
app.patch('/todos/:id', tokenAuth, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'isCompleted']);

    if (!ObjectID.isValid(id)) return res.status(404).send();

    if (_.isBoolean(body.isCompleted) && body.isCompleted) {
        body.completedAt = new Date().getTime();
    } else {
        body.isCompleted = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id: id,
        _createdBy: req.user._id
    }, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    }).catch((err) => {
        return res.status(400).send();
    });
});

/**
 * User///////////////////////////////////
 */
//add user
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user); //custom header
    }).catch(err => {
        res.status(400).send(err);
    });
});

//get user
app.get('/users/me', tokenAuth, (req, res) => {
    res.send(req.user);
});

//user login
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((error) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', tokenAuth, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send();
    });
});

//host
app.listen(3000, () => {
    console.log(`server is live on 3000`);
});