/**
 * Created by prasanna_d on 9/18/2017.
 */
app.controller('SettingsViewController',[
    '$scope', '$http', 'host_url',
    function ($scope, $http, host_url) {

        //Error flags
        $scope.isSubmit = false;
        $scope.app_id_empty_error = false;
        $scope.token_empty_error  = false;
        $scope.errorResetFlag = function (type) {
            switch (type){
                case 'app_id_empty_error':
                    $scope.app_id_empty_error = false;
                    break;
                case 'token_empty_error':
                    $scope.token_empty_error = false;
                    break;
            }
        };

        //Initialize variables
        $scope.settings={app_id: '', token: ''};
        $scope.onInit = async function () {
            console.log('Initializing settings view');
            let result = await $http({
                method: "GET",
                url: host_url + "settings/get",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            if(result) {
                $scope.settings = result.data.settings;
                $scope.$apply();
            }
        };

        //update settings
        $scope.updateSettings = async function(){
            let con = true;
            if($scope.settings.app_id.replace(" ","")===''){
                $scope.app_id_empty_error = true; con = false;
            }
            if($scope.settings.token.replace(" ","")===''){
                $scope.token_empty_error = true; con = false;
            }
            if(con){
                let result = await $http({
                    method: "POST",
                    url: host_url + "settings/update",
                    data: 'token=' + $scope.settings.token + '&app_id=' + $scope.settings.app_id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                if(result){
                    $scope.settings = result.data.settings;
                    $scope.$apply();
                }
            }

        }
    }
]);