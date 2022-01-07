const fs = require('fs');
const Datastore = require('nedb');
const parse = require('csv-parse');
const databaseFile = 'data/java.db'
const MAX_REMAINING_QUESTINS = 25;

const database = new Datastore(databaseFile);
database.loadDatabase();
let remainingQuestions = 0;
getNumberOfQuestions();
checkAndAddQuestions();

function loadData() {
    fs.createReadStream('../java4.csv')
        .pipe(parse({ delimiter: '\t' }))
        .on('data', function (csvrow) {
            console.log(csvrow);
            let question = {
                question: csvrow[0],
                answer: csvrow[1],
                date: Date.now(),
                level: 0
            };
            database.insert(question);
        })
        .on('end', function () {
            console.log('Successfully loaded data')
        });
}

function getNumberOfQuestions() {
    database.find({ date: { $lte: Date.now() } }).limit(MAX_REMAINING_QUESTINS).exec(function (err, docs) {
        remainingQuestions = docs.length;
        console.log("Remaining questions: ", remainingQuestions);
    });
}

function checkAndAddQuestions(){
    if (remainingQuestions < MAX_REMAINING_QUESTINS) {
        loadData()
    } else {
        console.log("There are too many remaining questions to load new data")
    }
}
