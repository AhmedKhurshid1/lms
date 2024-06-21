const mongoose = require('mongoose');

const BaseSchema = new mongoose.Schema({
    isInActive: { type: Boolean, default: true }, // False Positives for inactive
    isDeleted: { type: Boolean, default: false },
}, {
    __v: 1,
    timestamps: true,
    discriminatorKey: 'baseProperties',
    collection: 'base'
});

module.exports = {
    BaseSchemaModel: mongoose.model('BaseTemp', BaseSchema)
}

