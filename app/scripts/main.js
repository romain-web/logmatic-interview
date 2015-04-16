//main.js

//*** Functions ***

function clearElt(elt) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
  }
}

var traceActions = {};

traceActions.histoGram = function(elemStr, data) {

  var values = data.values;
  //var values = data;

  var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var color = d3.scale.ordinal()
    .range(["red", "blue"]);

  var x = d3.scale.ordinal()
    .domain(d3.range(values.length))
    .rangeRoundBands([0, height], 0.1);

  var y = d3.scale.linear()
    .domain([0, d3.max(values, function(d) { return d.m; })])
    .range([height, 0]);
  //
  //var xAxis = d3.svg.axis()
  //  .scale(x)
  //  .orient("bottom");

  var svg = d3.select(elemStr)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");

  var bars = svg.selectAll(".bar")
    .data(values)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) { return "translate(" + x(i+1) + "," + 0 + ")"; });

  bars.append("rect")
    .attr("y", function(d) { return y(d.m); })
    .attr("fill", function(d, i) { return color(i%2); })
    .attr("width", x.rangeBand())
    .attr("height", function(d) { return height - y(d.m); });

  bars.append("text")
    .attr("x",x.rangeBand() - ( x.rangeBand() / 2))
    .attr("y", function(d) { return y(d.m) - 10 ; })
    .attr("dx", -6)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(function(d) { return d.m; });
  //
  //svg.append("g")
  //  .attr("class", "x axis")
  //  .attr("transform", "translate(0," + height + ")")
  //  .call(xAxis);

  //
};

traceActions.list = function(datas) {

};


//*** Globals ***

var dimensionSelector = document.getElementById('dimension');
var resultText = document.getElementById('result');


//*** Events ***

var onChange = function () {

  clearElt(resultText);
  console.log('Loading values for ' + dimensionSelector.value + ' ...');
  resultText.appendChild(document.createTextNode('Loading ...'));

  mockAnalytics(dimensionSelector.value, function (err, res) {
    console.log(err, res);
    clearElt(resultText);
//
    traceActions.histoGram('#result', res);
  //
    var text = err || JSON.stringify(res, null, 2);
    resultText.appendChild(document.createTextNode(text));
  });
};


//*** Initialisation ***
(function() {
  dimensionSelector.addEventListener("change", onChange);
  onChange();
})();
