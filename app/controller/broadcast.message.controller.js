/**
 * Created by prasanna_d on 9/15/2017.
 */
app.controller('BroadcastMessage',[
    '$scope','$http','host_url','AuthService','$location',
    function ($scope,$http,host_url,AuthService,$location) {
        $scope.count = 0;
        $scope.isSend = false;
        $scope.sendMessage = async function () {
            try{
                let result = await $http({
                    method: "POST",
                    url: host_url + "broadcast",
                    data: 'message=' + $scope.message,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                $scope.isSend = true;
                console.log('Message sent to :');
                console.log(result.data.sent_users);
                $scope.count = result.data.sent_users.length;
                $scope.$apply();
            }catch (err){
                if(err.status===401){
                    AuthService.Logout();
                    $location.path('/');
                }
            }
        }
    }
]);