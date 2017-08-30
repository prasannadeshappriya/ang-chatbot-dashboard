/**
 * Created by prasanna_d on 8/30/2017.
 */
app.controller('mainController',[
    '$scope', '$http',
    function ($scope,$http) {
        //-----------------------Alert Show Section-----------------------
        $scope.dangerAlert = false;
        $scope.successAlert = false;
        $scope.message = '';
        //-----------------------On Loading-------------------------------
        $scope.onInit = function () {
            console.log('Initializing variables');
        };
        //-----------------------Views Section----------------------------
        $scope.showEntitySection = true;
        $scope.showSettingsSection = false;
        $scope.viewController = {
            intent: true, settings: false, entity: false
        };
        $scope.showView = function (view_name) {
            Object.keys($scope.viewController)
                .forEach(function (key) {
                    if(key===view_name){$scope.viewController[key]=true;}
                    else{$scope.viewController[key]=false;}
                });
        };
        //----------------------------------------------------------------
        $scope.appEntities = [
            {name: 'leave'}, {name: 'funny'}
        ];
        $scope.appIntents = [
            {name: 'leave'}, {name: 'funny'}
        ];
        if($scope.appIntents.length>0){$scope.selectedIntentName = $scope.appIntents[0].name;}
        if($scope.appEntities.length>0){$scope.selectedEntityName = $scope.appEntities[0].name;}
    }
]);