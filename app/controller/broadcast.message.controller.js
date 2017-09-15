/**
 * Created by prasanna_d on 9/15/2017.
 */
app.controller('BroadcastMessage',[
    '$scope','$http','host_url',
    function ($scope,$http,host_url) {
        $scope.count = 0;
        $scope.isSend = false;
        $scope.sendMessage = async function () {
            let result = await $http({
                method: "POST",
                url: host_url + "broadcast",
                data: 'message=' + $scope.message,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            $scope.isSend = true;
            $scope.count = result.data.count;
            $scope.$apply();
        }
    }
]);