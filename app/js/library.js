var remote = require('remote');
var fs = remote.require('fs');
// var util = require('util');
var stream = require('stream');
var es = require('event-stream'); // https://github.com/dominictarr/event-stream
var dialog = remote.require('dialog');
var $ = require('jquery');
var cbr = require('cbr');

var lineNr = 1;

var filePiper(fileName, err) { // Streams files passed through the program.
  console.log('filePiper ln1 :: ' + fs.createReadStream(fileName));
  var stream = fs.createReadStream(fileName);
  console.log('filePiper ln2 :: ' +  stream.pipe());
  stream.pipe();
  catch(err) {
    console.log('filePiper failure.');
  };
});

function openFile() {
  dialog.showOpenDialog(
    { filters: [{
      name: 'cbr',
      extensions: ['cbr']
      }]
    },

    // Open File function
    function(fileNames) {
      console.log(fileNames); //logs file in dev tools console
      if (fileNames === undefined) return;
      var fileName = fileNames[0];
      filePiper(fileName);








    //   var s = fs.createReadStream('fileName')
    //     .pipe(es.split())
    //     .pipe(es.mapSync(function(line) {
    //         // s.pause(); // Pauses readStream
    //         // lineNr += 1; // Increments lineNr +1
    //         // logMemoryUsage(lineNr); // Process line here and call s.resume() when ready
    //         // s.resume(); // Resumes readStream
    //       })
    //       // .on('error', function() {
    //       // 	console.log('Error while reading file');
    //       // })
    //       // .on('end', function() {
    //       // 	console.log('Read file successful')
    //       // })
    //     );
    //
    //
    //     fs.readFile(fileName, 'utf-8', function(err, data) {
    //       if (err) throw err;
    //       console.log('Line 103 good!')
    //       // s(fileName);
    //       console.log(s(fileName));
    //       console.log('IZ GUD!')
    //
    //       console.log(fileName); // example: "/home/user/(comic).cbr"
    //       console.log(data);
    //     });
    // }
  );
}