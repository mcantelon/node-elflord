require('angular');
require('angular-ui-router/release/angular-ui-router.min');

var services = angular.module('services', [])
  .service('TaskService',  function($http  ) {
    this.getTasks = function() {
      return $http({
        method: 'GET',
        url: 'tasks'
      });
    };
  });

var elflord = angular.module('elflord', [
  'ui.router',
  services.name
]);

elflord.config(function($stateProvider, $urlRouterProvider, elflord.services) {
  // default for unmatched
  $urlRouterProvider.otherwise("/list");

  $stateProvider
    .state('list', {
      url: "/list",
      templateUrl: "partials/list.html",
      controller: function(TaskService) {
console.log('list trig');
        /*
        TaskService.getTasks()
          .success(function (stuff) {
console.log(stuff);
          });
        */
      }
    })
    .state('state1.list', {
      url: "/list",
      templateUrl: "partials/state1.list.html",
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
    })
    .state('statey', {
      url: "/statey",
      templateUrl: "partials/statey.html"
    })
    .state('state2.list', {
      url: "/list",
        templateUrl: "partials/state2.list.html",
        controller: function($scope) {
          $scope.things = ["A", "Set", "Of", "Things"];
        }
      })
    });

console.log('loaded');
