/**
 * Created by prasanna_d on 8/30/2017.
 */
app.config(['$routeProvider', function ($routeProvider) {
    console.log('asdasd');
    $routeProvider
        .when("/",{
            //Dashboard home page
            templateUrl: "views/home.view.html",
            controller: 'mainController',
            resolve:{
                init: function () {
                    console.log('Dashboard route triggered');
                }
            }
        })
}]);