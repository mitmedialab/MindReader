import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Result = new Schema({
    player: {
        type:  Number,
        default: 0
    },
    bot: {
        type:  Number,
        default: 0
    }
});

export default mongoose.model('Result', Result
);
