var fs = require('fs'); 
const Datastore = require('nedb');
var parse = require('csv-parse');

const database = new Datastore('java.db');
database.loadDatabase();

fs.createReadStream('java1.csv')
    .pipe(parse({delimiter: '\t'}))
    .on('data', function(csvrow) {
        console.log(csvrow);
        let question = {
            question: csvrow[0], 
            answer: csvrow[1], 
            date: Date.now(),
            level: 0
        };
        database.insert(question);       
    })
    .on('end',function() {
      console.log('Successfully loaded data')
    });
