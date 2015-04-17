//main.js

Vue.config.debug = true;

//*** Functions ***

function clearElt(elt) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
  }
}

function getPercent(val,total) {
  return val / total * 100;
}

function getPercentStr(val,total) {
  return parseInt(getPercent(val,total)) + ' %';
}

var traceActions = {};

traceActions.histoGram = function(elemStr, values, total, transitionTime) {

  var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var color = d3.scale.ordinal()
    .range(['#039be5', '#0277bd']);

  var x = d3.scale.ordinal()
    .domain(d3.range(values.length))
    .rangeRoundBands([0, width], 0.3);

  var y = d3.scale.linear()
    .domain([0, total])
    .range([height, 0]);

  var svg = d3.select(elemStr)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(0,0)')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMidYMid')
    .append('g');

  var bars = svg.selectAll('.bar')
    .data(values)
    .enter().append('g')
    .attr('class', 'bar tooltipChart')
    .attr('data-position','right')
    .attr('data-delay',50)
    .attr('data-tooltip','')
    .attr('transform', function(d, i) { return 'translate(' + x(i) + ',' + 0 + ')'; });

  bars.append('rect')
    .attr('y', height)
    .attr('fill', function(d, i) { return color(i%2); })
    .attr('width', x.rangeBand())
    .attr('height', 0);

  //value
  bars.append('text')
    .attr('x',x.rangeBand() - ( x.rangeBand() / 2))
    .attr('y', height)
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('text-anchor', 'end')
    .text(function(d) { return d.m; });

  //percent
  bars.append('text')
    .attr('class', 'percent')
    .attr('x',x.rangeBand() - ( x.rangeBand() / 2))
    .attr('y', height )
    .attr('dx', 0)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end');

  // Transition >>
  var rect = svg.selectAll('.bar rect').data(values);
  var percent = svg.selectAll('.bar text.percent').data(values);
  var delay = function(d, i) { return i * 50; };

  rect.transition().duration(transitionTime)
    .delay(delay)
    .attr('y', function(d) { return y(d.m); })
    .attr('height', function(d) { return height - y(d.m); });

  percent.transition().duration(transitionTime)
    .delay(delay)
    .attr('y', function(d) {
      if (y(d.m) < (height - margin.top*2.5))
        return y(d.m) + margin.top ;
      else
        return y(d.m) - margin.top ;
    })
    .text(function(d) { return getPercentStr(d.m ,total); });
  // <<

  $('.tooltipChart').tooltip({delay: 110});

  return svg;
};

traceActions.histoGramResize = function(datas) {

};

traceActions.list = function(datas) {

};

traceActions.listResize = function(datas) {

};

function getListOfDimension(list) {
  var tab = [];
  _.forEach(list, function(obj){
    var d = dimension(obj);
    tab.push({
      text: d.name(),
      value: d.id()
    })
  });
  return tab;
}

//*** Globals ***

var resultText = document.getElementById('result');
var dataView = document.getElementById('dataview');


//*** Initialisation ***

var DatasComponent = new Vue({
  el: '#firstcard',
  data: {
    isList: false,
    onLoading: true
  },
  methods: {
    showLoading: function() {
      this.$data.onLoading = true;
    },
    hideLoading: function() {
      this.$data.onLoading = false;
    },
    clearResult: function() {
      clearElt(resultText);
      this.hideLoading();
    },
    makeGraph: function(data) {
      this.clearResult();
      traceActions.histoGram(
        '#result',
        _.reject(data, function(obj) {return obj.s === '_TOTAL_'}),
        _.find(data, function(obj) {return obj.s === '_TOTAL_'}).m,
        750
      );
    }
  }
});

var DimensionComponent = new Vue({
  el: '#dimension',
  data: {
    selected : dimension(dimensions[0]).id(),
    items : getListOfDimension(dimensions),
    dimension: {}
  },
  watch: {
    'selected': function (val, oldVal) {
      console.log(val,oldVal);
      this.getDimension();
    }
  },
  methods: {
    getDimension: function () {

      var d = this.$data;

      if (d.selected === null
        || d.selected === ''
        || _.isUndefined(d.selected)) {
        console.log('Error, no dimension selected');
        return;
      }

      d.dimension =  dimension(d.selected);
      DatasComponent.showLoading();
      console.log('Loading values for ' + d.selected + ' ...');

      mockAnalytics(d.selected, function (err, res) {
        console.log(err, res);
        if (!_.isNull(err)) {
          Materialize.toast(
            err,
            1000,
            '',
            function(){
              d.selected = dimension(dimensions[0]).id();
            }
          )
        } else {
          DatasComponent.makeGraph(res.values);
        }

        clearElt(dataView);
        var text = err || JSON.stringify(res, null, 2);
        dataView.appendChild(document.createTextNode(text));
      });
    }
  }
});

//init first step
DimensionComponent.getDimension();


var aspect = 500 / 300;

$(window).on('resize', function() {
  chart = $('#result svg');
  console.log('heelo resize',chart);
  var targetWidth = chart.parent().width();
  chart.attr('width', targetWidth);
  chart.attr('height', targetWidth / aspect);
});
