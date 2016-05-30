// Begin: ExampleController
/* global app */

function ExampleController($scope, ExampleService) {
    $scope.show = false;
    $scope.serviceMessage = ExampleService.getMessage();
}

app.controller('ExampleController', ['$scope', 'ExampleService', ExampleController]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider) {
    $routeProvider.when('/example', {
        templateUrl: 'views/example.html',
        controller: 'ExampleController'
    });
}]);

// End: ExampleController