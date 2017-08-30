/**
 * Created by prasanna_d on 8/30/2017.
 */
angular.module('chat-bot-app')
    .factory('PageRefreshService',[
        '$http',
        function ($http) {
            let services = {};
            services.run = run;
            return services;

            function run() {
                console.log('page refreshed')
            }
        }
    ]);