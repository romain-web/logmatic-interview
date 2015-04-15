//objects.js

// >> Do not change
function dimension (definition) {
  var obj = {};

  obj.id = function () {
    return definition.id;
  };

  obj.name = function () {
    return definition.name || definition.id;
  };

  var values = definition.values || [];
  var valueHash = {};
  values.forEach(function (v) {
    valueHash[v.id] = v;
  });

  obj.valueName = function (id) {
    var v = valueHash[id];
    return (v && v.name) || id;
  };

  obj.valueIcon = function (id) {
    var v = valueHash[id];
    return (v && v.icon) || id;
  };

  obj.valueHash = function (id) {
    var v = valueHash[id];
    return {
      id: id,
      name: obj.valueName(id),
      icon: obj.valueIcon(id)
    };
  };

  obj.values = function () {
    return values.map(function (v) { return v.id; });
  };

  return obj;
}

function mockAnalytics (dimensionId, callback) {
  if (dimensionId === "transportation") {
    setTimeout(function() {
      callback(null, {
        values: [
          { s: "auto", m: 15 },
          { s: "moto", m: 9 },
          { s: "train", m: 7 },
          { s: "ship", m: 4 },
          { s: "foot", m: 1 },
          { s: "_TOTAL_", m: 56 }
        ]
      });
    }, 1000);
  } else if (dimensionId === "maker") {
    setTimeout(function() {
      callback(null, {
        values: [
          { s: "fiat", m: 21 },
          { s: "renault", m: 13 },
          { s: "psa", m: 7 },
          { s: "airbus", m: 1 },
          { s: "_TOTAL_", m: 56 }
        ]
      });
    }, 1000);
  } else {
    setTimeout(function () {
      callback("Error, no such dimension");
    });
  }
}

var dimensions = [{
  id: "transportation",
  name: "Transportation",
  values: [{
    id:  "auto",
    name: "Automobile",
    icon: "automobile"
  }, {
    id: "moto",
    name: "Motorcycle",
    icon: "motorcycle"
  }, {
    id: "plane",
    name: "Plane",
    icon: "plane"
  }, {
    id: "train",
    name: "Train",
    icon: "train"
  }, {
    id: "foot",
    name: "On Foot"
  }]
}, {
  id: "maker",
  name: "Maker",
  values: []
}, {
  id: "driver",
  name: "Driver"
}];
// Do not change <<