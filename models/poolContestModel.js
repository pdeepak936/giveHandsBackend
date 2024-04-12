const mongoose = require('mongoose');

const poolContestSchema = new mongoose.Schema({
    match_id: {
    type: Number,
    required: true,
    },
    price_pool_percent: {
    type: Number,
    },
    price_pool: {
        type: Number,
        required: true,
    },
    entry_fee: {
        type: Number,
        required: true,
    },
    total_spots: {
        type: Number,
        require: true,
    },
    winning_spots: {
        type: Number,
        require: true,
    },
    winning_spots_precent: {
        type: Number,
        require: true,
    },
    first_prize: {
        type: Number
    },
    left_spots: {
        type: Number
    },
    done_spots: {
        type: Number,
        default: 0,
    }  
});

const poolContestModel = mongoose.model('PoolContest', poolContestSchema);

module.exports = poolContestModel;