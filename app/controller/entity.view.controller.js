/**
 * Created by prasanna_d on 9/4/2017.
 */
app.controller('EntityController',[
    '$scope','PageViewService','$http','host_url',
    function ($scope,PageViewService,$http,host_url) {
        //Data Section
        $scope.$watch(PageViewService.getViewData, function (newValue,old) {
            if(newValue){
                $scope.selectedIntentName = newValue.intent_name;
                $scope.currentEntities = [];
                for(let i=0; i<$scope.appEntities.length; i++ ){
                    if($scope.appEntities[i].intent_name===newValue.intent_name){
                        $scope.currentEntities.push($scope.appEntities[i]);
                    }
                }
                if($scope.currentEntities.length>0){$scope.selectedEntityName = $scope.currentEntities[0].name;}
            }
        },true);
        //Variable data init
        $scope.appEntities = [];
        $scope.currentEntities = [];
        if($scope.appEntities.length>0){$scope.selectedEntityName = $scope.appEntities[0].name;}
        //-----------------------On Loading-----------------------------------------------------------------------------
        //Initialize Variables
        $scope.appEntities = [];
        if($scope.appEntities.length>0){$scope.selectedEntityName = $scope.appEntities[0].name;}
        $scope.onInit = async function () {
            console.log('Initializing entity variables');
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "entity/get?entityid=all"
                });
                let resData = result.data.data;
                for(let i=0; i<resData.length; i++){
                    $scope.appEntities.push(resData[i]);
                }
                $scope.$apply();
            }catch (err){
                console.log(err);
            }
        };
        //--------------------------------------------------------------------------------------------------------------
        $scope.add_expressions = [];
        $scope.add_intent_expressions = [];
        $scope.btn_add_expressions = function () {
            if(typeof $scope.add_exp_value!=='undefined' && $scope.add_exp_value!==''){
                if($scope.add_expressions.indexOf($scope.add_exp_value)===-1){
                    $scope.add_expressions.push($scope.add_exp_value);
                    $scope.add_exp_value = '';
                }
            }
        };
        $scope.btn_add_intent_expressions = function () {
            if(typeof $scope.add_exp_int_value!=='undefined' && $scope.add_exp_int_value!==''){
                if($scope.add_intent_expressions.indexOf($scope.add_exp_int_value)===-1){
                    $scope.add_intent_expressions.push($scope.add_exp_int_value);
                    $scope.add_exp_int_value = '';
                }
            }
        };
        $scope.exp_add_item_int_click = function (item) {
            for(let i=0; i<$scope.add_intent_expressions.length; i++){
                if($scope.add_intent_expressions[i]===item){
                    $scope.add_intent_expressions.splice((i),1);
                }
            }
        }
        $scope.exp_add_item_click = function (item) {
            for(let i=0; i<$scope.add_expressions.length; i++){
                if($scope.add_expressions[i]===item){
                    $scope.add_expressions.splice((i),1);
                }
            }
        }
    }
]);