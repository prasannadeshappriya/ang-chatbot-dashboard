/**
 * Created by prasanna_d on 9/4/2017.
 */
app.controller('EntityController',[
    '$scope','PageViewService',
    function ($scope,PageViewService) {
        //Data Section
        $scope.selectedIntentName = '';
        $scope.$watch(PageViewService.getViewData, function (newValue,old) {
            if(newValue){
                $scope.selectedIntentName = newValue.intent_name;
            }
        },true);
        //Variable data init
        $scope.appEntities = [
            {name: 'leave', description: ''}, {name: 'funny', description: ''}
        ];
        if($scope.appEntities.length>0){$scope.selectedEntityName = $scope.appEntities[0].name;}
    }
]);