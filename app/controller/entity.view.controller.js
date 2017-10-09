/**
 * Created by prasanna_d on 9/4/2017.
 */
app.controller('EntityController',[
    '$scope','PageViewService','$http','host_url','AppEntitiesService',
    function ($scope,PageViewService,$http,host_url,AppEntitiesService) {
        function prepareData(data) {
            let skip_items=['&nbsp;','<span>','</span>'];
            let output=data;
            for(let j=0; j<skip_items.length; j++) {
                let intent_Data = output.split(skip_items[j]);
                let ret;
                if (intent_Data.length > 0) {ret = intent_Data[0];}
                let replace_chr = '';
                if(skip_items[j]==='&nbsp;'){replace_chr = ' ';}
                if (intent_Data.length > 1) {for (let i = 1; i < intent_Data.length; i++) {ret = ret + replace_chr + intent_Data[i];}}
                output = ret;
            }
            return output;
        }
        //-----------------------Alert Show Section---------------------------------------------------------------------
        $scope.dangerAlert = false;
        $scope.successAlert = false;
        $scope.message = '';
        let resetAlert = function () {
            $scope.dangerAlert = false;
            $scope.successAlert = false;
            $scope.message = '';
        };
        //App Entities Section------------------------------------------------------------------------------------------
        $scope.appEntities = [];
        $scope.$watch(AppEntitiesService.getAppEntities, async function (newValue) {
            if(newValue){
                if(typeof newValue!=='undefined'){
                    $scope.appEntities = [];
                    for (let i=0; i<newValue.length; i++){
                        if(!newValue[i].includes('wit/')
                            && newValue[i]!=='Custom' && newValue[i]!=='intent'){$scope.appEntities.push(newValue[i])}
                    }
                }
            }
        },true);
        $scope.appEntityItemClick = function (item) {
            console.log(item);
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
            if(typeof $scope.entityAddExpressions!=='undefined' && $scope.entityAddExpressions!=='') {
                for (let i = 0; i < $scope.entityExpressions.length; i++) {
                    if ($scope.entityAddExpressions === $scope.entityExpressions[i]) {con = false;break;}
                }
                if (con) {$scope.entityExpressions.push($scope.entityAddExpressions);$scope.entityAddExpressions = '';}
            }
        };
        $scope.btnAddValue = function () {
            //Value field validate
            let con = true;
            if(typeof $scope.entityAddValue==='undefined' || $scope.entityAddValue ===''){
                $scope.entity_value_empty = true;
                con = false;
            }
            if(typeof $scope.entityData==='undefined' || $scope.entityData.replace(' ','') ===''){
                $scope.entity_data_empty = true;
                con = false;
            }
            if(con) {
                let tmp_obj = {};
                tmp_obj.value = $scope.entityAddValue;
                tmp_obj.expressions = $scope.entityExpressions;
                tmp_obj.data = prepareData($scope.entityData);
                $scope.values.push(tmp_obj);
                $scope.entityAddValue = '';
                $scope.entityExpressions = [];
                $scope.entityData =' ';
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
            if($scope.tmp_keyword_error){con = false;}
            if(con){
                //Database call
                let result = await $http({
                    method: "POST",
                    url: host_url + "entity/create",
                    data: 'entity_name='+ $scope.entityName + '&entity_data=' + JSON.stringify($scope.values) + '&entity_description=' + $scope.entityDesc,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                console.log(result);
                if(result.status===201){
                    let data;
                    if($scope.values.length===0){
                        data = 'doc='+ $scope.entityDesc+ '&id=' + $scope.entityName + '&lookups=' + JSON.stringify($scope.selectedLoockup.replace("&","%26"));
                    }else{
                        let values = JSON.stringify( $scope.values, function( key, value ) {
                            if( key === "$$hashKey" || key === "data" ) {return undefined;}
                            return value;
                        });
                        data = 'doc='+ $scope.entityDesc+ '&id=' + $scope.entityName + '&lookups=' + JSON.stringify($scope.selectedLoockup.replace("&","%26")) +
                            '&values=' + values;
                    }
                    result = await $http({
                        method: "POST",
                        url: host_url + "wit/postEntity",
                        data: data,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    if(result.status===200){
                        $scope.entityDesc = ''; $scope.entityName = ''; $scope.entityData =' ';
                        $scope.values = []; $scope.entityExpressions = [];
                        $scope.message = 'Entity successfully created!';
                        $scope.successAlert = true;
                        $scope.$apply();
                        location.reload();
                    }else{
                        $scope.message = 'Error occurred!';
                        $scope.dangerAlert = true;
                        $scope.$apply();
                    }
                }else{
                    $scope.message = 'Error occurred!';
                    $scope.dangerAlert = true;
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
        $scope.test = function () {
            console.log('testing');
        };
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
                case 'entity_value_empty':
                    $scope.entity_value_empty = false;
                    break;
                case 'entity_data_empty':
                    $scope.entity_data_empty = false;
                    break;
            }
        };
        //--------------------------------------------------------------------------------------------------------------
        //Some strategies are not working, this is to avid from such inputs, temporary solution
        $scope.tmp_keyword_error = false;
        $scope.selectLookupStrategy = function () {
            if($scope.selectedLoockup==='free-text & keywords' ||
                $scope.selectedLoockup==='free-text'){
                $scope.tmp_keyword_error = true;
            }else{
                $scope.tmp_keyword_error = false;
            }
        };
        //--------------------------------------------------------------------------------------------------------------
        $scope.onCurrentValuesClick=function (item) {
            for(let i=0; i<$scope.values.length; i++){
                if($scope.values[i].value===item.value){
                    let con = true;
                    if($scope.values[i].expressions.length===item.expressions.length) {
                        let count = item.expressions.length;
                        for (let j = 0; j < count; j++){
                            if(item.expressions[j]!==$scope.values[i].expressions[j]){con = false;}
                        }
                    }else{con = false;}
                    if(con){$scope.values.splice(i,1);}
                }
            }
        };
    }
]);