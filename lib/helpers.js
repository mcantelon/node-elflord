exports.displayTasks = function(tasks) {
  for (var index in tasks) {
    console.log(tasks[index].description);
  }
}
