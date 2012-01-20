exports.propertySorter = function(property, reverse) {
  return function(a, b) {
    var direction = (reverse == true) ? -1 : 1;
    if (a[property] < b[property]) return -1 * direction;
    if (a[property] > b[property]) return 1 * direction;
    return 0;
  }
}

exports.objectToSortable = function(object) {
  sortable = [];
  for (var key in object) {
    sortable.push({key: key, value: object[key]});
  }
  return sortable;
}

exports.display = function(format, sortable) {
  sortable.map(function(pair) {
    console.log(format, pair.key, pair.value);
  });
}
