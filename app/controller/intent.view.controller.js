/**
 * Created by prasanna_d on 9/4/2017.
 */
app.controller('IntentController',[
    '$scope','$http','host_url','PageViewService',
    'AuthService','$location',
    function ($scope,$http,host_url,PageViewService,
              AuthService,$location) {
        //-----------------------Alert Show Section---------------------------------------------------------------------
        $scope.dangerAlert = false;
        $scope.successAlert = false;
        $scope.message = '';
        let resetAlert = function () {
            $scope.dangerAlert = false;
            $scope.successAlert = false;
            $scope.message = '';
        };
        //-----------------------On Loading-----------------------------------------------------------------------------
        //Initialize intent Variables
        $scope.appIntents = [];
        $scope.appIntentsLookups = [];
        if($scope.appIntents.length>0){$scope.selectedIntentName = $scope.appIntents[0].name;}
        $scope.onInit = async function () {
            console.log('Initializing variables');
            $scope.isLoading = true;
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "intent/get?intentid=all"
                });
                let resData = result.data.data;
                for(let i=0; i<resData.length; i++){
                    $scope.appIntents.push(resData[i])
                }
                if($scope.appIntents.length>0){$scope.selectedIntentName = $scope.appIntents[0].name;}
                result = await $http({
                    method: "GET",
                    url: host_url + "wit/getEntityById?entity_name=intent"
                });
                if(result.status===200) {
                    $scope.indentDes = result.data.data.doc;
                    $scope.appIntentsLookups = result.data.data.lookups;
                    $scope.appIntents = result.data.data.values;
                }else{
                    $scope.message = 'Error occurred!';
                    $scope.dangerAlert = true;
                    $scope.$apply();
                }
                $scope.isLoading = false;
                $scope.$apply();
            }catch (err){
                console.log(err);
                if(err.status===401){
                    AuthService.Logout();
                    $location.path('/');
                }
                $scope.message = 'Error occurred!';
                $scope.dangerAlert = true;
                $scope.isLoading = false;
                $scope.$apply();
            }
        };
        //-----------------------Data Validation Section----------------------------------------------------------------
        $scope.isSubmit = false;
        $scope.isLoading = true;
        $scope.panel_loading = false;
        $scope.isModelLoading = false;
        $scope.intent_name_empty = false;
        $scope.intent_name_dublicate = false;
        $scope.intent_description_empty = false;
        $scope.intent_data_empty = false;
        $scope.intent_model_data_empty = false;
        $scope.changeText = function (field) {
            switch (field){
                case 'intent_name_empty':
                    $scope.intent_name_empty = false;
                    break;
                case 'intent_name_dublicate':
                    $scope.intent_name_dublicate = false;
                    break;
                case 'intent_description_empty':
                    $scope.intent_description_empty = false;
                    break;
                case 'intent_data_empty':
                    $scope.intent_data_empty = false;
                    break;
                case 'intent_model_data_empty':
                    $scope.intent_model_data_empty = false;
                    break;
            }
        };
        //------------------------Intent Update Model Section-----------------------------------------------------------
        $scope.selectedappIntents = {};
        $scope.appIntentsItemClick = async function (item) {
            $scope.isModelLoading = true;
            $scope.selectedappIntents = angular.copy(item);
            $scope.intUpdateExpression = '';
            let result = await $http({
                method: "GET",
                url: host_url + "intent/get?intentid=" + $scope.selectedappIntents.value,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            $scope.isModelLoading = false;
            if(result.data.data[1]) {
                $scope.intentModelData = result.data.data[1].data;
            }
            $scope.$apply();
        };
        $scope.appIntentsItemDelete = async function () {
            let tmp_arr = [];
            for(let i=0; i<$scope.appIntents.length; i++ ){
                if($scope.appIntents[i].value!==$scope.selectedappIntents.value){
                    tmp_arr.push($scope.appIntents[i]);
                }
            }
            $scope.appIntents = tmp_arr;
            $scope.isModelLoading = true;
            try {
                let result = await $http({
                    method: "POST",
                    url: host_url + "intent/delete",
                    data: 'intent_name=' + $scope.selectedappIntents.value,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                if (result.status === 200) {
                    let data = JSON.stringify($scope.appIntents, function (key, value) {
                        if (key === "$$hashKey") {
                            return undefined;
                        }
                        return value;
                    });
                    if (typeof $scope.indentDes === 'undefined') {
                        $scope.indentDes = '';
                    }
                    result = await $http({
                        method: "POST",
                        url: host_url + "wit/putEntityById",
                        data: 'entity_name=' + 'intent' + '&wit_values=' + data + '&wit_doc=' + $scope.indentDes,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    if (result.status === 200) {
                        $scope.message = 'Intent successfully deleted!';
                        $scope.successAlert = true;
                        $scope.isModelLoading = false;
                        $scope.$apply();
                    } else {
                        $scope.isModelLoading = false;
                        $scope.message = 'Error occurred!';
                        $scope.dangerAlert = true;
                        $scope.$apply();
                    }
                } else {
                    $scope.isModelLoading = false;
                    $scope.message = 'Error occurred!';
                    $scope.dangerAlert = true;
                    $scope.$apply();
                }
            }catch (err){
                $scope.isModelLoading = false;
                $scope.message = 'Error occurred!';
                $scope.dangerAlert = true;
                $scope.$apply();
            }
            $('#updateData').modal('hide');
        };
        $scope.appIntentsItemUpdate = async function () {
            let con = true;
            $scope.intent_model_data_empty = false;
            if(typeof $scope.intentModelData==='undefined' ||
                    $scope.intentModelData === ''){
                $scope.intent_model_data_empty = true; con = false;
            }
            if(con) {
                $scope.isModelLoading = true;
                let tmp_arr = [];
                for (let i = 0; i < $scope.appIntents.length; i++) {
                    if ($scope.appIntents[i].value !== $scope.selectedappIntents.value) {
                        tmp_arr.push($scope.appIntents[i]);
                    } else {
                        tmp_arr.push($scope.selectedappIntents);
                    }
                }
                $scope.appIntents = tmp_arr;
                let data = JSON.stringify($scope.appIntents, function (key, value) {
                    if (key === "$$hashKey") {
                        return undefined;
                    }
                    return value;
                });
                if (typeof $scope.indentDes === 'undefined') {
                    $scope.indentDes = '';
                }
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "intent/update",
                        data: 'intent_name=' + $scope.selectedappIntents.value + '&intent_data=' + $scope.intentModelData,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    if(result.data.data) {
                        try {
                            let result = await $http({
                                method: "POST",
                                url: host_url + "wit/putEntityById",
                                data: 'entity_name=' + 'intent' + '&wit_values=' + data + '&wit_doc=' + $scope.indentDes,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            });
                            $scope.isModelLoading = false;
                            $scope.message = 'Intent successfully updated!';
                            $scope.successAlert = true;
                            $scope.$apply();
                        }catch (err){
                            $scope.isModelLoading = false;
                            $scope.message = 'Internal server error';
                            $scope.dangerAlert = true;
                            $scope.$apply();
                        }
                    }else {
                        $scope.isModelLoading = false;
                        $scope.message = 'Something wrong!';
                        $scope.dangerAlert = true;
                        $scope.$apply();
                    }
                }catch (err){
                    $scope.isModelLoading = false;
                    $scope.message = 'Internal server error';
                    $scope.dangerAlert = true;
                    $scope.$apply();
                }
                $('#updateData').modal('hide');
            }
        };
        $scope.appIntentsUpdateItemClick = function (item) {
            for(let i=0; i<$scope.selectedappIntents.expressions.length; i++){
                if($scope.selectedappIntents.expressions[i]===item){
                    $scope.selectedappIntents.expressions.splice((i),1);
                }
            }
        };
        $scope.btn_update_add_expressions = function () {
            if($scope.intUpdateExpression!==''&&typeof $scope.intUpdateExpression!=='undefined'){
                let con = true;
                for(let i=0; i<$scope.selectedappIntents.expressions.length; i++){
                    if($scope.selectedappIntents.expressions[i]===$scope.intUpdateExpression){con = false; break;}
                }
                if(con){$scope.selectedappIntents.expressions.push($scope.intUpdateExpression);
                    $scope.intUpdateExpression = '';}
            }
        };
        //Create New Intent
        $scope.createNewIntent = async function () {
            resetAlert();
            $scope.isSubmit = true;
            $scope.panel_loading = true;
            let con = true;
            if($scope.intentName==='' || typeof $scope.intentName==='undefined'){$scope.intent_name_empty = true; con = false;}
            if($scope.indentDes==='' || typeof $scope.indentDes==='undefined'){$scope.intent_description_empty = true; con = false;}
            if($scope.intentData==='' || typeof $scope.intentData==='undefined'){$scope.intent_data_empty = true; con = false;}
            if(con){
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "intent/create",
                        data: 'intent_name='+ $scope.intentName+ '&intent_description=' + $scope.indentDes +
                                    '&intent_data=' + $scope.intentData,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    console.log(result);
                    if(result){
                        if(result.status===201){
                            $scope.appIntents.push({value: $scope.intentName, expressions: $scope.add_expressions});
                            $scope.selectedIntentName = $scope.intentName;

                            let data = JSON.stringify( $scope.appIntents, function( key, value ) {
                                if( key === "$$hashKey" ) {return undefined;}
                                return value;
                            });

                            let result = await $http({
                                method: "POST",
                                url: host_url + "wit/putEntityById",
                                data: 'entity_name='+ 'intent'+ '&wit_values=' + data + '&wit_doc=' + $scope.indentDes,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            });
                            if(result.status===200) {
                                console.log(result);
                                $scope.message = 'Intent successfully created!';
                                $scope.successAlert = true;
                                $scope.panel_loading = false;
                                $scope.intentName = ''; $scope.intentData = '';
                                $scope.add_expressions = [];
                                $scope.$apply();
                            }else{
                                $scope.message = 'Error occurred!';
                                $scope.panel_loading = false;
                                $scope.dangerAlert = true;
                                $scope.$apply();
                            }
                        }else{
                            $scope.message = 'Error occurred!';
                            $scope.dangerAlert = true;
                            $scope.panel_loading = false;
                            $scope.$apply();
                        }
                    }
                    console.log('Intent successfully created!');
                }catch (err){
                    if(err.status===409){$scope.intent_name_dublicate = true;
                        $scope.panel_loading = false; $scope.$apply();}
                    // console.log(err);
                }
            }
        };
        //View Controller-----------------------------------------------------------------------------------------------
        $scope.showView = function (view_name) {
            PageViewService.setViewData('intent_name',$scope.selectedIntentName);
            PageViewService.setViewController(view_name);
        };
        //--------------------------------------------------------------------------------------------------------------
        $scope.add_expressions = [];
        $scope.btn_add_expressions = function () {
            if(typeof $scope.intentName==='undefined' || $scope.intentName===''){
                $scope.intent_name_empty = true;
                $scope.isSubmit = true;
            }else {
                if (typeof $scope.add_exp_value !== 'undefined' && $scope.add_exp_value !== '') {
                    if ($scope.add_expressions.indexOf($scope.add_exp_value) === -1) {
                        $scope.add_expressions.push($scope.add_exp_value);
                        $scope.add_exp_value = '';
                    }
                }
            }
        };
    }
]);