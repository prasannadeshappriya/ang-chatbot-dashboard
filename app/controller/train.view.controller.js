/**
 * Created by prasanna_d on 9/6/2017.
 */
app.controller('TrainController',[
    '$scope','$http','host_url','AppEntitiesService',
    function ($scope,$http,host_url,AppEntitiesService ) {
        //Validation----------------------------------------------------------------------------------------------------
        $scope.result = null;
        $scope.isSubmit = false;
        $scope.isLoading = false;
        $scope.expression_empty = false;
        $scope.changeText = function (field) {
            switch (field){
                case 'expression_empty':
                    $scope.isSubmit = false;
                    $scope.expression_empty = false;
                    break;
            }
        };
        $scope.entities = [];
        //--------------------------------------------------------------------------------------------------------------

        //Initialization------------------------------------------------------------------------------------------------
        $scope.onInit = async function () {
            console.log('Initializing training view');
            $scope.isLoading=true;
            let result = await $http({
                method: "GET",
                url: host_url + "wit/getEntities"
            });
            for(let i=0 ;i<result.data.data.length; i++){
                result.data.data[i] = result.data.data[i].replace("$","/");
            }
            AppEntitiesService.setAppEntities(result.data.data);
            $scope.entities = result.data.data;
            $scope.entities.push("Custom");
            $scope.values = [{value: "Custom"}];
            $scope.selectedEntity = "Custom";
            $scope.showCustomInputBox = true;
            $scope.showCustomInputValueBox = true;
            $scope.isLoading=false;
            // $scope.$apply();
        };

        //Error messages section----------------------------------------------------------------------------------------
        $scope.server_400_error = false;
        $scope.no_values_error = false;
        $scope.server_error = false;
        $scope.entity_name_empty = false;
        $scope.entity_value_empty = false;
        $scope.changeText = function (field) {
            switch (field){
                case 'entity_name_empty':
                    $scope.entity_name_empty = false;
                    break;
                case 'entity_value_empty':
                    $scope.entity_value_empty = false;
                    break;
                case 'expression_empty':
                    $scope.expression_empty = false;
                    break;
            }
        };
        //--------------------------------------------------------------------------------------------------------------

        $scope.expressionOnChange = function () {
            if(!$scope.user_input!=='' && typeof $scope.user_input!=='undefined'){
                if($scope.user_input.length>0){
                    let start = 0;
                    $scope.values = [{value: "Custom"}];
                    for(let i=0; i<$scope.user_input.length; i++){
                        if($scope.user_input[i]===" "){
                            let tmp_arr = {};
                            tmp_arr["start"] = start;
                            tmp_arr["end"] = i;
                            tmp_arr["value"] = $scope.user_input.substring(start,i);
                            $scope.values.push(tmp_arr);
                            start = i+1;
                        }
                    }
                    let tmp_arr = {};
                    tmp_arr["start"] = start;
                    tmp_arr["end"] = $scope.user_input.length;
                    tmp_arr["value"] = $scope.user_input.substring(start,$scope.user_input.length);
                    $scope.values.push(tmp_arr);
                }
            }
        };

        $scope.selectedEntityValue = "Custom";
        $scope.values = [];
        $scope.entityArr = [];
        $scope.btnAddEntity = function () {
            let con = true;
            if(($scope.selectedEntity==="Custom") &&
                (typeof $scope.entityName==="undefined" || $scope.entityName==="")){
                $scope.entity_name_empty = true; con = false;
            }
            if(($scope.selectedEntityValue==="Custom") &&
                (typeof $scope.entityValue==="undefined" || $scope.entityValue==="")){
                $scope.entity_value_empty = true; con = false;
            }
            if(con){
                if($scope.user_input==='' || typeof $scope.user_input==='undefined'){
                    $scope.expression_empty = true;
                }else{
                    $scope.no_values_error = false;
                    let tmp_obj = {}; let entity;
                    if($scope.selectedEntity==="Custom"){ entity = $scope.entityName;}
                    else{entity = $scope.selectedEntity;}
                    tmp_obj["entity"] = entity;
                    if($scope.selectedEntityValue==="Custom"){tmp_obj["value"] = $scope.entityValue;}
                    else{
                        for(let i=0 ;i<$scope.values.length; i++){
                            if($scope.values[i].value===$scope.selectedEntityValue){
                                tmp_obj["start"] = $scope.values[i].start;
                                tmp_obj["end"] = $scope.values[i].end;
                                tmp_obj["value"] = $scope.values[i].value;
                            }
                        }
                    }
                    $scope.entityArr.push(tmp_obj);
                }
            }
        };

        $scope.btnValidateEntity = async function () {
            console.log($scope.entityArr);
            if($scope.entityArr.length>0){
                if($scope.user_input==='' || typeof $scope.user_input==='undefined'){
                    $scope.expression_empty = true;
                }else{
                    //Reset the error flags
                    $scope.server_400_error=false;
                    $scope.server_error = false;
                    let data = JSON.stringify($scope.entityArr, function (key, value) {
                        if (key === "$$hashKey") {
                            return undefined;
                        }
                        return value;
                    });
                    try {
                        $scope.isLoading = true;
                        $scope.result = null;
                        $scope.isSubmit = false;
                        let result = await $http({
                            method: "POST",
                            url: host_url + "wit/postSample",
                            data: 'text=' + $scope.user_input + '&entities=' + data,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        if(result.status===200){
                            //Clear the array and reset values
                            $scope.selectedEntityValue = "Custom"; $scope.selectedEntity = "Custom";
                            $scope.entityName = ""; $scope.entityValue = "";
                            $scope.showCustomInputValueBox = true; $scope.showCustomInputBox = true;
                            $scope.entityArr = []; $scope.isLoading = false; $scope.$apply();
                        }else{$scope.server_error = true;}
                    }catch (err){
                        if(err.status===400){$scope.server_400_error=true;
                        }else{$scope.server_error = true;}
                        $scope.isLoading = false;
                        $scope.$apply();
                    }


                }
            }else{
                $scope.no_values_error = true;
            }
        };

        $scope.valueSelect = function () {
            $scope.showCustomInputValueBox = false;
            $scope.entity_value_empty = false;
            if($scope.selectedEntityValue==="Custom")  {$scope.showCustomInputValueBox = true;}
        };
        $scope.entitySelect = function () {
            $scope.showCustomInputBox = false;
            $scope.entity_name_empty = false;
            if($scope.selectedEntity==="Custom")  {$scope.showCustomInputBox = true;}
        };

        $scope.btnCheck = async function () {
            //validation user expression
            let con = true;
            if($scope.user_input==='' || typeof $scope.user_input==='undefined'){
                $scope.expression_empty = true; con = false;
            }
            if(con){
                $scope.isSubmit = true;
                $scope.isLoading = true;
                let message = $scope.user_input.replace(" ","%20");
                let result = await $http({
                    method: "GET",
                    url: host_url + "wit/getMessage?message=" + message,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                if(Object.keys(result.data.data.entities).length===0){$scope.result = null;}
                else{$scope.result = result.data.data.entities;}
                $scope.isLoading = false;
                $scope.$apply();
            }
        };

        $scope.removeValue = function (item) {
            for(let i=0; i<$scope.entityArr.length; i++){
                if($scope.entityArr[i].value === item.value &&
                    $scope.entityArr[i].entity === item.entity){
                    $scope.entityArr.splice(i,1);
                    break;
                }
            }
        }
    }


]);