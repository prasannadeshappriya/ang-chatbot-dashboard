/**
 * Created by prasanna_d on 8/30/2017.
 */
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/dashboard",{
            //Dashboard home page
            templateUrl: "views/home.view.html",
            controller: 'mainController',
            resolve:{
                init: function (AuthService,$location) {
                    console.log('Dashboard route triggered');
                    //Should see weather user logged in, otherwise redirect to the login page
                    if(AuthService.getUser()===null) {
                        console.log('Unauthorized url request');
                        $location.path('/');
                    }
                }
            }
        })
        .when("/login",{
            //Login page
            templateUrl: "views/user.auth.html",
            controller: 'UserAuthController',
            resolve:{
                init: function (AuthService,$location) {
                    console.log('Login route triggered');
                    if (AuthService.getUser()!==null) {
                        $location.path('/dashboard');
                    }
                }
            }
        })
        .when("/",{
            //Login page
            templateUrl: "views/user.auth.html",
            controller: 'UserAuthController',
            resolve:{
                init: function (AuthService,$location) {
                    console.log('Login route triggered');
                    if (AuthService.getUser()!==null) {
                        $location.path('/dashboard');
                    }
                }
            }
        })
}]);