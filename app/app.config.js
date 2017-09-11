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
                init: function () {
                    console.log('Dashboard route triggered');
                    //Should see weather user logged in, otherwise redirect to the login page
                }
            }
        })
        .when("/login",{
            //Login page
            templateUrl: "views/user.auth.html",
            controller: 'UserAuthController',
            resolve:{
                init: function () {console.log('Login route triggered');}
            }
        })
        .when("/",{
            //Login page
            templateUrl: "views/user.auth.html",
            controller: 'UserAuthController',
            resolve:{
                init: function () {console.log('Login route triggered');}
            }
        })
}]);