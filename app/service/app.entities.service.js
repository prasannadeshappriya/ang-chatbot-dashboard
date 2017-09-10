/**
 * Created by prasanna on 9/10/17.
 */
angular.module('chat-bot-app')
    .factory('AppEntitiesService',[
        '$http',
        function ($http) {
            let services = {};
            let appEntities = [];
            services.setAppEntities = setAppEntities;
            services.getAppEntities = getAppEntities;
            return services;
            function getAppEntities() {
                return appEntities;
            }
            function setAppEntities(arrEntities) {
                appEntities = arrEntities;
            }
        }
    ]);