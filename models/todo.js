var mongoose = require('mongoose');

var Todo = mongoose.model('Todos', {
    text: {
        type: String,
        required: 'text field is required',
        demand: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: String
    },
    _createdBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = {
    Todo
};