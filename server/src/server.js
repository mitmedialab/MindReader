import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Result from './models/GameRes';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/MainDB', { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

router.route('/results').get((req, res) => {
    console.log("getting results")
    Result.find((err, issues) => {
        if (err)
            console.log(err);
        else
            res.json(issues);
    });
});

//TODO: fix v0 in mongo
router.route('/results/add').post((req, res) => {
    let result = new Result(req.body);
    result.save()
        .then(result => {
             console.log("inserting)");
            res.status(200).json({'result': 'Added successfully'});
        })
        .catch(err => {
            console.log("error!");

            console.log(err);
            res.status(400).send('Failed to create new record');

        });
});

app.use('/', router);

app.listen(4300, () => console.log('Express server running on port 4300'));
