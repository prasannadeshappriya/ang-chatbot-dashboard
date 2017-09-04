/**
 * Created by prasanna_d on 8/30/2017.
 */
app.controller('mainController',[
    '$scope', '$http', 'host_url','PageViewService',
    function ($scope,$http,host_url,PageViewService) {
        //-----------------------Views Section--------------------------------------------------------------------------
        $scope.viewController = {
            intent: true, settings: false, entity: false
        };
        $scope.$watch(PageViewService.getViewController, function (newValue,old) {
            if(newValue){
                $scope.viewController = newValue;
            }
        },true);
        $scope.showView = function (view_name) {
            PageViewService.setViewController(view_name);
        };
    }
]);