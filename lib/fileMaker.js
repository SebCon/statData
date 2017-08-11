

var fileMaker = function(id, separator) {
  var error = false;
  var self = this;
  var wContent = [];
  var index = 0;
  var elem, textFile;

  var _SEPARATOR = ';';

  if (id !== undefined) {
    self.id = id;
  } else {
    self.id = "fileMaker";
  }

  if (!separator) {
    this.separator = _SEPARATOR;
  }


  var init = function() {
    elem = document.getElementById(id);
    if (!elem) {
      error = true;
      abort();
    }
  };

  var abort = function() {
    if (error) {
      console.error('cannot initalize elem with id: '+id);
    }
  };

  var addContent = function(content) {
    if (content) {
      var temp = _SEPARATOR + content;
      if (wContent[index] === undefined || wContent[index] === '') {
        temp = content;
      }
      wContent[index] += temp;
    }
  };

  var addNewLine = function() {
    index++;
  };


  function makeTextFile() {
    if (wContent.length > 0) {
      var text;
      for (var i=0; i < wContent.length; i++) {
        text += wContent[i] + '\r\n';
      }
      //console.log('create makefile');
      var data = new Blob([text], {type: 'text/plain'});

      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      textFile = window.URL.createObjectURL(data);

      if (elem) {
        elem.innerHTML = '<a href="'+textFile+'">Download Average</a>';
      }
    }
  };

  init();
  return {
    init : init,
    addContent : addContent,
    addNewLine : addNewLine,
    makeTextFile : makeTextFile
  };
};
