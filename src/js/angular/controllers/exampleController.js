// Begin: ExampleController
/* global app */

function ExampleController(ExampleService) {
    this.show = false;
    this.serviceMessage = ExampleService.getMessage();

    return this;
}

app.controller('ExampleController', ['ExampleService', ExampleController]); 

app.config(['$routeProvider', '$locationProvider', function($routeProvider) {
    $routeProvider.when('/example', {
        templateUrl: 'views/example.html',
        controller: 'ExampleController'
    });

    //FOO
}]);

// End: ExampleController