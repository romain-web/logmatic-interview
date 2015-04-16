//main.js

//*** Functions ***

function clearElt(elt) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
  }
}

function refactoringData(data, dim) {
  var values = data;
  _.intersection()
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
    .attr("transform", function(d, i) { console.log(d,i,x(i));  return "translate(" + x(i) + "," + 0 + ")"; });

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

var resultText = document.getElementById('result');
var dataView = document.getElementById('dataview');

//*** Initialisation ***
(function() {

  var DatasComponent = new Vue({
    el: '#firstcard',
    data: {
      onLoading: true
    },
    methods: {
      showLoading: function() {
        this.$data.onLoading = true;
      },
      hideLoading: function() {
        this.$data.onLoading = false;
      }
    }
  });

  var DimensionComponent = new Vue({
    el: '#dimension',
    data: {
      items : dimensions
    },
    methods: {
      getDimension: function (e) {
        console.log('passe',e);
        if(!_.isUndefined(e)) {
          e.stopPropagation();
        }

        clearElt(resultText);
        clearElt(dataView);
        console.log('Loading values for ' + this.$el.value + ' ...');
        DatasComponent.showLoading();

        mockAnalytics(this.$el.value, function (err, res) {
          console.log(err, res);
          clearElt(resultText);
          DatasComponent.hideLoading();
      //
          traceActions.histoGram('#result', res);
        //
          var text = err || JSON.stringify(res, null, 2);
          dataView.appendChild(document.createTextNode(text));
        });
      }
    }
  });

  //init first step
  DimensionComponent.getDimension();
  $('#dimension').change(function(){console.log('test change',$(this).val())});
})();
