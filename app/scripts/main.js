//main.js

function clearElt(elt) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
  }
}

var dimensionSelector = document.getElementById("dimension");
var resultText = document.getElementById("result");

var onChange = function (){
  clearElt(resultText);
  console.log("Loading values for " + dimensionSelector.value + " ...");
  resultText.appendChild(document.createTextNode("Loading ..."));
  mockAnalytics(dimensionSelector.value, function (err, res) {
    console.log(err, res);
    clearElt(resultText);
    var text = err || JSON.stringify(res, null, 2);
    resultText.appendChild(document.createTextNode(text));
  });
};

dimensionSelector.addEventListener("change", onChange);

onChange();