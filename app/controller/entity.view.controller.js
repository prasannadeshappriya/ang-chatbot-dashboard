/**
 * Created by prasanna_d on 9/4/2017.
 */
app.controller('EntityController',[
    '$scope','PageViewService','$http','host_url',
    function ($scope,PageViewService,$http,host_url) {
        //-----------------------Alert Show Section---------------------------------------------------------------------
        $scope.dangerAlert = false;
        $scope.successAlert = false;
        $scope.message = '';
        let resetAlert = function () {
            $scope.dangerAlert = false;
            $scope.successAlert = false;
            $scope.message = '';
        };
        //--------------------------------------------------------------------------------------------------------------
        $scope.appLoockups = ["trait","free-text & keywords","free-text","keywords"];
        $scope.selectedLoockup = $scope.appLoockups[0];
        $scope.values = [];
        $scope.entityExpressions = [];
        $scope.entityExpressionsItemClick = function (item) {
            for(let i=0; i< $scope.entityExpressions.length; i++){
                if(item===$scope.entityExpressions[i]){
                    $scope.entityExpressions.splice(i,1); break;}
            }
        };
        $scope.btnAddExpression = function () {
            let con = true;
            for(let i=0; i< $scope.entityExpressions.length; i++){
                if($scope.entityAddExpressions===$scope.entityExpressions[i]){con =false; break;}
            }
            if(con){$scope.entityExpressions.push($scope.entityAddExpressions);
                $scope.entityAddExpressions='';}
        };
        $scope.btnAddValue = function () {
            //Value field validate
            let con = true;
            if(typeof $scope.entityAddValue==='undefined' || $scope.entityAddValue ===''){
                $scope.entity_value_empty = true;
                con = false;
            }
            if(con) {
                let tmp_obj = {};
                tmp_obj.value = $scope.entityAddValue;
                tmp_obj.expressions = $scope.entityExpressions;
                $scope.values.push(tmp_obj);
                $scope.entityAddValue = '';
                $scope.entityExpressions = [];
            }
        };
        $scope.createEntity = async function () {
            resetAlert();
            $scope.isSubmit = true;
            //Data validation
            let con = true;
            if(typeof $scope.entityName==='undefined' || $scope.entityName===''){
                $scope.entity_name_empty = true; con = false;
            }
            if(typeof $scope.entityDesc==='undefined' || $scope.entityDesc===''){
                $scope.entity_des_empty = true; con = false;
            }
            if(typeof $scope.entityData==='undefined' || $scope.entityData===''){
                $scope.entity_data_empty = true; con = false;
            }
            if(con){
                //Database call
                // let data = $scope.entityData;

                let values = JSON.stringify( $scope.values, function( key, value ) {
                    if( key === "$$hashKey" ) {return undefined;}
                    return value;
                });
                let result = await $http({
                    method: "POST",
                    url: host_url + "wit/postEntity",
                    data: 'doc='+ $scope.entityDesc+ '&id=' + $scope.entityName + '&lookups=' + JSON.stringify($scope.selectedLoockup) +
                            '&values=' + values,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                if(result.status===200){
                    $scope.entityDesc = ''; $scope.entityName = ''; $scope.entityData ='';
                    $scope.values = []; $scope.entityExpressions = [];
                    $scope.message = 'Intent successfully deleted!';
                    $scope.successAlert = true;
                    $scope.$apply();
                }
            }
        };
        //Error messages------------------------------------------------------------------------------------------------
        $scope.isSubmit = false;
        $scope.entity_name_empty = false;
        $scope.entity_name_dublicate = false;
        $scope.entity_des_empty = false;
        $scope.entity_data_empty = false;
        $scope.entity_value_empty = false;
        $scope.changeText = function (field) {
            switch (field){
                case 'entity_name_empty':
                    $scope.entity_name_empty = false;
                    break;
                case 'entity_name_dublicate':
                    $scope.entity_name_dublicate = false;
                    break;
                case 'entity_des_empty':
                    $scope.entity_des_empty = false;
                    break;
                case 'entity_data_empty':
                    $scope.entity_data_empty = false;
                    break;
                case 'entity_value_empty':
                    $scope.entity_value_empty = false;
                    break;
            }
        };
        //--------------------------------------------------------------------------------------------------------------
    }
]);