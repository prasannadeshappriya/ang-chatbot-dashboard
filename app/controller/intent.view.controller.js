/**
 * Created by prasanna_d on 9/4/2017.
 */
app.controller('IntentController',[
    '$scope','$http','host_url','PageViewService',
    function ($scope,$http,host_url,PageViewService) {
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
        //Initialize Variables
        $scope.appIntents = [];
        if($scope.appIntents.length>0){$scope.selectedIntentName = $scope.appIntents[0].name;}
        $scope.onInit = async function () {
            console.log('Initializing variables');
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
                $scope.$apply();
            }catch (err){
                console.log(err);
            }
        };
        //-----------------------Data Validation Section----------------------------------------------------------------
        $scope.isSubmit = false;
        $scope.intent_name_empty = false;
        $scope.intent_name_dublicate = false;
        $scope.intent_description_empty = false;
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
            }
        };
        //Create New Intent
        $scope.createNewIntent = async function () {
            resetAlert();
            $scope.isSubmit = true;
            let con = true;
            if($scope.intentName==='' || typeof $scope.intentName==='undefined'){$scope.intent_name_empty = true; con = false;}
            if($scope.indentDes==='' || typeof $scope.indentDes==='undefined'){$scope.intent_description_empty = true; con = false;}
            if(con){
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "intent/create",
                        data: 'intent_name='+ $scope.intentName+ '&intent_description=' + $scope.indentDes,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    console.log(result);
                    if(result){
                        if(result.status===201){
                            $scope.message = 'Intent successfully created!';
                            $scope.successAlert = true;
                            $scope.appIntents.push({name: $scope.intentName, description: $scope.indentDes});
                            $scope.selectedIntentName = $scope.intentName; $scope.intentName = ''; $scope.indentDes = '';
                            $scope.$apply();
                        }
                    }
                }catch (err){
                    if(err.status===409){$scope.intent_name_dublicate = true; $scope.$apply();}
                    // console.log(err);
                }
            }
        };
        //Delete an Existing Intent
        $scope.deleteIntent = async function () {
            if($scope.selectedIntentName==='' || typeof $scope.selectedIntentName==='undefined'){
                $scope.message = "You don't have any intents!";
                $scope.dangerAlert = true;
                return;
            }
            try {
                let result = await $http({
                    method: "POST",
                    url: host_url + "intent/delete",
                    data: 'intent_name='+ $scope.selectedIntentName,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                console.log(result);
                if(result){
                    if (result.status===200){
                        for(let i=0; i<$scope.appIntents.length; i++){
                            if($scope.appIntents[i].name===$scope.selectedIntentName){
                                $scope.appIntents.splice(i,1);
                                if($scope.appIntents.length>0){$scope.selectedIntentName = $scope.appIntents[0].name;};
                                $scope.$apply();break;
                            }
                        }
                    }
                }
            }catch (err){
                console.log(err);
            }
            console.log('You are going to delete: ' + $scope.selectedIntentName);
        };
        $scope.showView = function (view_name) {
            PageViewService.setViewData('intent_name',$scope.selectedIntentName);
            PageViewService.setViewController(view_name);
        }
    }
]);