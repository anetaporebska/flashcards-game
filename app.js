const express = require('express');
const Datastore = require('nedb');
const QUESTIONS_PER_ROUND = 25;
const STATS_LENGTH = 20;

const app = express();
app.listen(3000)
app.use(express.static('front'))
app.use(express.json({limit: '100kb'}))

const database = new Datastore('./app/data/data.db');
database.loadDatabase();

const statistics = new Datastore('statistics.db');
statistics.loadDatabase();


let questions = []
let questionNumber = 0;
let stats = []
let today = new Date()
today.setHours(0,0,0,0)

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

database.find({ date: { $lte: Date.now() } }).limit(QUESTIONS_PER_ROUND).exec(function(err, docs){
    questions = docs;
    questionNumber = questions.length;
    questions = shuffleArray(questions);
});

app.get('/questions', (request, response) => {
    console.log('GET questions request');
    response.json(questions)
    response.end()
});

app.get('/stats', (request, response) => {
    console.log('GET stats request');
    statistics.find({ date: { $lte: today } }).limit(STATS_LENGTH).exec(function(err, docs){
        stats = docs;
    });
    response.json(stats)
    response.end()
});

app.post('/question', (request, response) => {
    console.log('POST question request')
    const question = request.body;
    console.log(question);
    database.remove({ _id: question._id });
    database.insert(question);
    response.end();
})

app.post('/score', (request, response) => {
    console.log('POST score request')
    const stat = request.body;
    console.log(stat);
    let knownSt = stat.known;
    let notKnownSt = stat.notKnown;
    let scoreSt = stat.score;
    statistics.find({date: today}, function(err, docs){
        console.log(docs);
        if (docs.length > 0){
            knownSt += docs[0].known;
            notKnownSt += docs[0].notKnown;
            scoreSt += docs[0].score;
            statistics.update({date: today}, {$set: {known: knownSt, notKnown: notKnownSt, score: scoreSt}}, {}, function (err, numReplaced){
                console.log('Replaced: ' + numReplaced);
            })
        }
        else{
            statistics.insert({date: today, known: knownSt, notKnown: notKnownSt, score: scoreSt})
        }
    })
    response.end();
})
