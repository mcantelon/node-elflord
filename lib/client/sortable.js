exports.compareByValueDescending = function(a, b) {
  return exports.compareByValue(a, b, true);
}

exports.compareByValue = function(a, b, reverse) {
  var direction = (reverse == true) ? -1 : 1;
  if (a.value < b.value) return -1 * direction;
  if (a.value > b.value) return 1 * direction;
  return 0;
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
