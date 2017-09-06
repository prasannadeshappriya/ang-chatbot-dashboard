/**
 * Created by prasanna_d on 8/30/2017.
 */
angular.module('chat-bot-app')
    .factory('PageViewService',[
        '$http',
        function ($http) {
            let viewData = {};
            let viewController = {
                intent: true, settings: false, entity: false, training: false
            };

            let services = {};
            services.getViewController = getViewController;
            services.setViewController = setViewController;
            services.setViewData = setViewData;
            services.getViewData = getViewData;
            return services;

            function getViewController() {return viewController;}
            function setViewController(view_name) {
                Object.keys(viewController)
                    .forEach(function (key) {
                        if(key===view_name){viewController[key]=true;}
                        else{viewController[key]=false;}
                    });
            }
            function setViewData(key, value) {
                viewData[key] = value;
            }
            function getViewData() {return viewData;}
        }
    ]);