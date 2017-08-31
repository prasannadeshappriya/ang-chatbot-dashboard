/**
 * Created by prasanna_d on 8/30/2017.
 */
app.controller('mainController',[
    '$scope', '$http', 'host_url',
    function ($scope,$http,host_url) {
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
        //-----------------------Data Validation Section----------------------------
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
        //----------------------------------------------------------------
        $scope.createNewIntent = async function () {
            console.log('create new intent');
            $scope.isSubmit = true;
            let con = true;
            if($scope.intentName==='' || typeof $scope.intentName==='undefined'){$scope.intent_name_empty = true; con = false;}
            if($scope.indentDes==='' || typeof $scope.indentDes==='undefined'){$scope.intent_description_empty = true; con = false;}
            if(con){
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "intent/create",
                        data: {intent_name: $scope.intentName, intent_description: $scope.indentDes}
                    });
                    console.log(result);
                }catch (err){
                    console.log(err);
                }
            }
        };
    }
]);