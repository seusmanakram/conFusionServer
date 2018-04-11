
// "name": "Peter Pan",
// "image": "images/alberto.png",
// "designation": "Chief Epicurious Officer",
// "abbr": "CEO",
// "description": "Our CEO, Peter, . . .",
// "featured": false

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    desgination: {
        type: String,
        default: ''
    },
    abbr: {
        type: String,
        default: ''

    },
    description:
    {
        type: String,
        required: true

    },
    featured: {
        type: Boolean,
        default: 'false'
    }
}, {
        timestamps: true
});

var Leaders = mongoose.model( 'Leader', leaderSchema);

module.exports = Leaders;
