// library.js : to populate the library with an interactive list of available selections

// TODO: there is an issue with 'Variant Covers'.  Figure out a way to make it unique.

var $ = require('jquery');
var colors = require('colors');
const {dialog} = require('electron').remote;
var dirTree = require('directory-tree'); // https://www.npmjs.com/package/directory-tree
var fs = require('fs');
var isThere = require('is-there');
var jsonfile = require('jsonfile'); // https://www.npmjs.com/package/jsonfile
var mkdirp = require('mkdirp');
var os = require('os');
var path = require('path');

// jsonfile.writeFileSync(output, jSon, {spaces: 2});

function libBuilder(directory, array, listID) {
  $('#libStatus').remove();
  for (var i=0; i < array.length; i++) {
    var file = path.join(directory, array[i].name)
    if (fs.statSync(file).isFile()) {

      newDirectory = dirEncode(directory);

      $('#' + listID).append('<li class="file"><a href="#" onclick="file.loader(\'' + path.join(newDirectory, encodeURIComponent(array[i].name)) + '\')"><i class="fa fa-file" aria-hidden="true"></i>' + array[i].name + '</a></li>')
    } else if (fs.statSync(file).isDirectory()) {

      var newListID = (listID + array[i].name).replace(/\s|#|\(|\)|\'|,|&|\+|-/g, "");
      $('#' + listID).append('<ul id=' + newListID + '><li class="folder"><a href="#" onclick="#"><i class="fa fa-folder" aria-hidden="true"></i>' + array[i].name + '</a></li>');
      libBuilder(file, array[i].children, newListID);
      $('#' + listID).append('</ul>');
    } else {
      console.log(array[i].name + ' skipped');
    };
  };
  $('#repeat').removeClass('rotater');
};

function dirEncode(oldPath) {
  var newPath = '';
  var tempPath = oldPath.split(path.sep);

  for (j=0; j < tempPath.length; j++) {
    newPath = path.join(newPath, encodeURIComponent(tempPath[j]));
  };

  if (process.platform != "win32") {
    newPath = '/' + newPath;
  };

  return newPath;
};

function loader() {
  dialog.showOpenDialog({
    properties: [
      'openDirectory'
    ]
  },
  function(fileNames) {
    if (fileNames === undefined) return;
    console.log(fileNames);

    var directory = fileNames[0];
    var file = path.join(os.tmpdir(), 'wonderReader', 'json', 'config.json');
    var obj = {'library': directory};
    var dirArray = dirTree(directory, ['.cbr', '.cbz']);
    var listID = 'ulLib';

    jsonfile.writeFileSync(file, obj);
    $('#ulLib li').remove();
    $('#ulLib ul').remove();

    $('#repeat').addClass('rotater');
    libBuilder(directory, dirArray.children, listID);
  });
};

exports.builder = () => {
  var config = jsonfile.readFileSync(path.join(os.tmpdir(), 'wonderReader', 'json', 'config.json'));
  var directory = config.library
  var dirArray = dirTree(directory, ['.cbr', '.cbz']);
  var listID = 'ulLib';
  $('#ulLib li').remove();
  $('#ulLib ul').remove();

  $('#repeat').addClass('rotater');
  libBuilder(directory, dirArray.children, listID)
};

exports.openDir = () => {
  loader()
}

exports.onLoad = () => {
  var configFile = path.join(os.tmpdir(), 'wonderReader', 'json', 'config.json')
  if (isThere(configFile)) {
    var config = jsonfile.readFileSync(configFile);
    if (config.library != undefined) {
      var dirArray = dirTree(config.library, ['.cbr', '.cbz']);
      var listID = 'ulLib';
      libBuilder(config.library, dirArray.children, listID)
    } else {
      $('#libStatus').append('The library is empty. Click <span class="code"><i class="fa fa-search"></i></span> to load a directory.');
    }
  } else {
    mkdirp.sync(path.join(os.tmpdir(), 'wonderReader', 'json'));
    fs.writeFileSync(configFile, '{}');
    $('#libStatus').append('The library is empty. Click <span class="code"><i class="fa fa-search"></i></span> to load a directory.');
  }
}