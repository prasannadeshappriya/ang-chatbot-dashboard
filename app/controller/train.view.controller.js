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
        $scope.entities = [];
        //--------------------------------------------------------------------------------------------------------------

        //Initialization------------------------------------------------------------------------------------------------
        $scope.onInit = async function () {
            console.log('Initializing training view');
            $scope.isLoading=true;
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "wit/getEntities"
                });
                if (result.status === 200) {
                    for (let i = 0; i < result.data.data.length; i++) {
                        result.data.data[i] = result.data.data[i].replace("$", "/");
                    }
                    AppEntitiesService.setAppEntities(result.data.data);
                    $scope.entities = result.data.data;
                    $scope.values = [{value: "Custom"}];
                    $scope.selectedEntity = $scope.entities[0];
                    $scope.showCustomInputValueBox = true;
                    $scope.isLoading = false;
                    $scope.$apply();
                }
            }catch (err){
                console.log(err);
            }
        };

        //Error messages section----------------------------------------------------------------------------------------
        $scope.server_400_error = false;
        $scope.no_values_error = false;
        $scope.server_error = false;
        $scope.entity_name_empty = false;
        $scope.entity_value_empty = false;
        $scope.entity_data_empty = false;
        $scope.changeText = function (field) {
            switch (field){
                case 'entity_value_empty':
                    $scope.entity_value_empty = false;
                    break;
                case 'expression_empty':
                    $scope.expression_empty = false;
                    break;
                case 'entity_data_empty':
                    $scope.entity_data_empty = false;
                    break;
            }
        };
        //--------------------------------------------------------------------------------------------------------------

        $scope.expressionOnChange = function () {
            if(!$scope.user_input!=='' && typeof $scope.user_input!=='undefined'){
                if($scope.user_input.length>0){
                    let start = 0;
                    if($scope.selectedEntity.includes('wit/')) {$scope.values = [];}
                    else{$scope.values = [{value: "Custom"}];}
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
                    tmp_arr = {};
                    tmp_arr["start"] = 0;
                    tmp_arr["end"] = $scope.user_input.length;
                    tmp_arr["value"] = $scope.user_input.substring(0,$scope.user_input.length);
                    $scope.values.push(tmp_arr);
                }
            }
        };

        $scope.selectedEntityValue = "Custom";
        $scope.values = [];
        $scope.entityArr = [];
        $scope.btnAddEntity = function () {
            let con = true;
            if(($scope.selectedEntityValue==="Custom") &&
                (typeof $scope.entityValue==="undefined" || $scope.entityValue==="")){
                $scope.entity_value_empty = true; con = false;
            }
            if(typeof $scope.entityData==="undefined" || $scope.entityData===""){
                $scope.entity_data_empty = true; con = false;
            }
            for(let i=0; i<$scope.entityArr.length; i++){
                if($scope.selectedEntityValue==="Custom") {
                    if ($scope.entityArr[i].value === $scope.entityValue) {
                        $scope.entity_value_exist = true;
                        con = false;
                        break;
                    }
                }else{
                    if($scope.entityArr[i].value===$scope.selectedEntityValue) {
                        $scope.entity_value_exist = true;
                        con = false;
                        break;
                    }
                }
            }
            if(con){
                $scope.entity_value_exist = false;
                if($scope.user_input==='' || typeof $scope.user_input==='undefined'){
                    $scope.expression_empty = true;
                }else{
                    $scope.no_values_error = false;
                    let tmp_obj = {}; let entity;
                    entity = $scope.selectedEntity;
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
                    tmp_obj["data"] = $scope.entityData;
                    $scope.entityArr.push(tmp_obj);
                }
            }
        };

        $scope.btnValidateEntity = async function () {
            let con = true;
            if($scope.user_input==='' || typeof $scope.user_input==='undefined') {
                $scope.expression_empty = true; con = false;
            }
            if($scope.entityArr.length===0) {
                $scope.no_values_error = true;
                con = false;
            }
            if(con){
                //Reset the error flags
                $scope.server_400_error=false;
                $scope.server_error = false;
                let entity_arr = $scope.entityArr;
                console.log(entity_arr);
                for(let i=0; i<entity_arr.length; i++){
                    if(entity_arr[i].entity.includes('wit/')){
                        entity_arr[i].entity = entity_arr[i].entity.replace("/","$");
                    }
                }
                let data = JSON.stringify(entity_arr, function (key, value) {
                    if (key === "$$hashKey" || key==="data") {return undefined;}
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
                        for(let i=0; i<entity_arr.length; i++){
                            let item = entity_arr[i];
                            let result = await $http({
                                method: "POST",
                                url: host_url + "entity/createOrUpdateEntityValue",
                                data: 'entity_name=' + item.entity + '&entity_value=' + item.value + '&entity_data=' + item.data,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            });
                            console.log(result);
                        }
                        //Clear the array and reset values
                        $scope.selectedEntityValue = "Custom"; $scope.selectedEntity = $scope.entities[0];
                        $scope.entityValue = "";
                        $scope.entityArr = []; $scope.isLoading = false; $scope.$apply();
                    }else{$scope.server_error = true;}
                }catch (err){
                    console.log(err);
                    if(err.status===400){$scope.server_400_error=true;
                    }else{$scope.server_error = true;}
                    $scope.isLoading = false;
                    $scope.$apply();
                }
            }
        };

        $scope.valueSelect = function () {
            $scope.showCustomInputValueBox = false;
            $scope.entity_value_empty = false;
            if($scope.selectedEntityValue==="Custom")  {$scope.showCustomInputValueBox = true;}
        };
        $scope.entitySelect = function () {
            if($scope.selectedEntity.includes('wit/')){
                for(let i=0; i<$scope.values.length; i++){
                    if($scope.values[i].value==='Custom'){
                        $scope.values.splice(i,1); break;}
                }
            }else{
                let con = true;
                for(let i=0; i<$scope.values.length; i++){
                    if($scope.values[i].value==='Custom'){
                        con = false; break;}
                }
                if(con){$scope.values.push({value: 'Custom'});}
                $scope.selectedEntityValue = 'Custom';
                $scope.showCustomInputValueBox = true;
            }
            $scope.entity_name_empty = false;
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