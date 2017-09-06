/**
 * Created by prasanna_d on 9/6/2017.
 */
app.controller('TrainController',[
    '$scope','$http','host_url',
    function ($scope,$http,host_url ) {
        //Validation
        $scope.result = null;
        $scope.isLoading = false;
        $scope.expression_empty = false;
        $scope.changeText = function (field) {
            switch (field){
                case 'expression_empty':
                    $scope.expression_empty = false;
                    break;
            }
        };

        $scope.btnCheck = async function () {
            //validation user expression
            let con = true;
            if($scope.user_input==='' || typeof $scope.user_input==='undefined'){
                $scope.expression_empty = true; con = false;
            }
            if(con){
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
        }
    }
]);