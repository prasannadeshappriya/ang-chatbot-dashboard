/**
 * Created by prasanna_d on 8/30/2017.
 */
app.controller('mainController',[
    '$scope', '$http',
    function ($scope,$http) {
        $scope.showEntitySection = true;
        $scope.showSettingsSection = false;
        $scope.viewController = {
            entity: true, settings: false
        };
        $scope.showView = function (view_name) {
            Object.keys($scope.viewController)
                .forEach(function (key) {
                    if(key===view_name){$scope.viewController[key]=true;}
                    else{$scope.viewController[key]=false;}
                });
        };
    }
]);