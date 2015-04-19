//main.js

"use strict";

Vue.config.debug = true;
var aspect = 500 / 300;

//*** Functions ***

function getElem(idStr) {
  return document.getElementById(idStr);
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
    .attr('data-tooltip', function(d) { return d.name; })
    .attr('transform', function(d, i) { return 'translate(' + x(i) + ',' + 0 + ')'; });

  bars.append('rect')
    .attr('class',function(d) { return d.s; } )
    .attr('id',function(d,i) { return i; } )
    .attr('y', height - margin.bottom)
    .attr('fill', function(d, i) { return color(i%2); })
    .attr('width', x.rangeBand())
    .attr('height', 0);

  //value
  bars.append('text')
    .attr('x',x.rangeBand() - ( x.rangeBand() / 2))
    .attr('y', height)
    .attr('dx', 6)
    .attr('dy', -5)
    .attr('text-anchor', 'end')
    .text(function(d) { return d.m; });

  //percent
  bars.append('text')
    .attr('class', 'percent')
    .attr('x',x.rangeBand() - ( x.rangeBand() / 2))
    .attr('y', height - margin.bottom)
    .attr('dx', 10)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end');

  // Transition >>
  var rect = svg.selectAll('.bar rect').data(values);
  var percent = svg.selectAll('.bar text.percent').data(values);
  var delay = function(d, i) { return i * 50; };

  rect.transition().duration(transitionTime)
    .delay(delay)
    .attr('y', function(d) { return y(d.m) - margin.bottom; })
    .attr('height', function(d) { return height - y(d.m); });

  percent.transition().duration(transitionTime)
    .delay(delay)
    .attr('y', function(d) {
      if (y(d.m) < (height - margin.top*2.5))
        return y(d.m) + margin.top - margin.bottom;
      else
        return y(d.m) - margin.top - margin.bottom;
    })
    .attr('fill', function(d) {
      if (y(d.m) < (height - margin.top*2.5))
        return '#ffffff' ;
      else
        return '#000000' ;
    })
    .text(function(d) { return getPercentStr(d.m ,total); });
  // <<

  // Tooltip from Materialize lib
  $('.tooltipChart').tooltip({delay: 110});

  return svg;
};

traceActions.list = function(elemStr, values, total, transitionTime) {

  var rowHeight = 36;

  var margin = {top: 20, right: 30, bottom: 30, left: 30},
      width = 500 - margin.left - margin.right,
      height = values.length * rowHeight;

  var color = d3.scale.ordinal()
    .range(['#039be5', '#0277bd']);

  var y = d3.scale.ordinal()
    .domain(d3.range(values.length))
    .rangeBands([height, 0], 0.1);

  var x = d3.scale.linear()
    .domain([0, total])
    .range([0, width]);

  var svg = d3.select(elemStr)
    .append('svg')
    .attr('width', width)
    .attr('height',height + rowHeight)
    .attr('transform', 'translate(0,0)')
    .append('g');

  var bars = svg.selectAll('.bar')
    .data(values)
    .enter().append('g')
    .attr('class', 'bar')
    .attr('transform', function(d, i) { return 'translate(' + 0 + ',' + ((height + rowHeight) -  y(i)) + ')'; });

  bars.append('rect')
    .attr('class',function(d) { return d.s; } )
    .attr('id',function(d,i) { return i; } )
    .attr('y', - y.rangeBand())
    .attr('fill', function(d, i) { return color(i%2); })
    .attr('height', y.rangeBand())
    .attr('width', 0);

  //percent
  bars.append('text')
    .attr('class', 'percent')
    .attr('y', - y.rangeBand() + ( y.rangeBand() / 2))
    .attr('x',  0)
    .attr('dx', 10)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .text(function(d) { return getPercentStr(d.m ,total); });

  // Transition >>
  var rect = svg.selectAll('.bar rect').data(values);
  var percent = svg.selectAll('.bar text.percent').data(values);
  var delay = function(d, i) { return i * 50; };

  rect.transition().duration(transitionTime)
    .delay(delay)
    .attr('width', function(d) { return x(d.m); });

  percent.transition().duration(transitionTime)
    .delay(delay)
    .attr('x', function(d) {
      if (x(d.m) < (margin.left*2.5))
        return x(d.m) + margin.left;
      else
        return x(d.m) - margin.left;
    })
    .attr('fill', function(d) {
      if (x(d.m) > (margin.left*2.5))
        return '#ffffff' ;
      else
        return '#000000' ;
    });
  // <<

  return svg;
};

traceActions.resizeFromParent = function(selectorStr) {
  var parent = d3.select(selectorStr);
  var chart = parent.selectAll('svg');
  var targetWidth = parseInt(parent.style('width'), 10) - 20;

  chart.attr('width', targetWidth);
  chart.attr('height', targetWidth / aspect);
};

traceActions.resizeListWidth = function(selectorStr, values, total, transitionTime) {
  var parent = d3.select(selectorStr);
  var chart = parent.selectAll('svg');

  var targetWidth = parseInt(parent.style('width'), 10) - 20;
  var margin = {top: 20, right: 30, bottom: 30, left: 30};

  var x = d3.scale.linear()
    .domain([0, total])
    .range([0, targetWidth]);

  var delay = function(d, i) { return i * 50; };

  chart.selectAll('.bar rect')
    .data(values)
    .transition()
    .duration(transitionTime)
    .delay(delay)
    .attr('width', function(d) { return x(d.m); });

  chart.selectAll('.bar text.percent')
    .data(values)
    .transition()
    .duration(transitionTime)
    .delay(delay)
    .attr('x', function(d) {
      if (x(d.m) < (margin.left*2.5))
        return x(d.m) + margin.left;
      else
        return x(d.m) - margin.left;
    })
    .attr('fill', function(d) {
      if (x(d.m) > (margin.left*2.5))
        return '#ffffff' ;
      else
        return '#000000' ;
    });
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


//*** Initialisation ***

var DatasComponent = new Vue({
  el: '#card',
  data: {
    isList: false,
    onLoading: true,
    dimensionObj: dimension,
    values: [],
    total: 0
  },
  methods: {
    updateCard: function(values, dimension) {
      var d = this.$data;
      if (!_.isUndefined(values) && !_.isUndefined(dimension)) {
        d.dimensionObj = dimension;
        d.values = _.reject(values, function(obj) {
          return obj.s === '_TOTAL_';
        });
        d.total = _.find(values, function(obj) {
          return obj.s === '_TOTAL_';
        }).m;
      }

      this.clearResult();
      if (!d.isList) {
        this.makeGraph();
      } else {
        this.makeList();
      }
    },
    showLoading: function() {
      this.$data.onLoading = true;
    },
    hideLoading: function() {
      this.$data.onLoading = false;
    },
    toggleView: function() {
      var d = this.$data;
      d.isList = !d.isList;
      //var card = d3.select('#card');
      //var container = card.select('.data-container');
      //var graph = container.select('.graph-container');
      //if (d.isList) {
      //  container.insert(graph);
      //}
      this.updateCard();
    },
    clearResult: function() {
      d3.selectAll('.datas-view').html('');
      this.hideLoading();
    },
    makeGraph: function() {
      var d = this.$data;
      traceActions.histoGram(
        '#card .graph-container',
        _.map(d.values, function (v) {
          v.name = d.dimensionObj.valueName(v.s);
          return v;
        }),
        d.total,
        750
      );
      this.resizeGraph();
    },
    makeList: function() {
      var d = this.$data;
      traceActions.list(
        '#card .graph-container',
        _.map(d.values, function (v) {
          v.name = d.dimensionObj.valueName(v.s);
          return v;
        }),
        d.total,
        750
      );
    },
    resizeListWidth: function () {
      var d = this.$data;
      traceActions.resizeListWidth(
        '.graph-container',
        _.map(d.values, function (v) {
          v.name = d.dimensionObj.valueName(v.s);
          return v;
        }),
        d.total,
        750
      );
    },
    resizeGraph: function () {
      traceActions.resizeFromParent('.graph-container.resizable');
    },
    hoverLineAction: function (valueId) {
      var rects = d3.select('#card .graph-container svg').selectAll('.' + valueId);
      rects.attr('fill', '#bf360c');
    },
    outLineAction: function (valueId) {
      var color = ['#039be5', '#0277bd'];
      var rects = d3.select('#card .graph-container svg')
        .selectAll('.' + valueId)
        .attr('fill', function() { return color[parseInt(this.id)%2]; });
    }
  }
});

var DimensionComponent = new Vue({
  el: '#dimension',
  data: {
    selected : dimension(dimensions[0]).id(),
    items : getListOfDimension(dimensions)
  },
  watch: {
    'selected': function (val, oldVal) {
      console.log(val,oldVal);
      this.getDimension();
    }
  },
  methods: {
    getDimensionObj: function () {
      var d = this.$data;
      return dimension(
        _.findWhere(dimensions, {id: d.selected})
      );
    },
    getDimension: function () {
      var that = this;
      var d = this.$data;

      if (d.selected === null
        || d.selected === ''
        || _.isUndefined(d.selected)) {
        console.log('Error, no dimension selected');
        return;
      }

      DatasComponent.showLoading();
      console.log('Loading values for ' + d.selected + ' ...');

      mockAnalytics(d.selected, function (err, res) {
        console.log(err, res);

        if (!_.isNull(err)) {
          DatasComponent.hideLoading();
          Materialize.toast(
            err,
            1000,
            '',
            function(){
              d.selected = DatasComponent.dimensionObj.id();
            }
          )
        } else {
          DatasComponent.updateCard(res.values, that.getDimensionObj());
        }

        /* Affichage Test */
        var dataView = getElem('dataview');
        var text = err || JSON.stringify(res, null, 2);
        dataView.appendChild(document.createTextNode(text));
        /* Affichage Test end */
      });
    }
  }
});

//init first step
function init() {
  DimensionComponent.getDimension();

  d3.select(window).on('resize', function () {
    if (DatasComponent.isList) {
      DatasComponent.resizeListWidth();
    } else {
      DatasComponent.resizeGraph();
    }
  });
}

init();