/**
 * Created by prasanna_d on 8/30/2017.
 */
angular.module('chat-bot-app')
    .factory('PageRefreshService',[
        '$http','$localStorage','AuthService','$location',
        function ($http, $localStorage, AuthService, $location) {
            let services = {};
            services.run = run;
            return services;

            function run() {
                console.log('page refreshed');
                if ($localStorage.currentUser) {
                    AuthService.setIsLogin(true);
                    $location.path('/dashboard');
                }
            }
        }
    ]);