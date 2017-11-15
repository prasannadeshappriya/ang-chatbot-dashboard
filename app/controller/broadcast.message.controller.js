/**
 * Created by prasanna_d on 9/15/2017.
 */
app.controller('BroadcastMessage',[
    '$scope','$http','host_url','AuthService','$location',
    function ($scope,$http,host_url,AuthService,$location) {
        function prepareData(data) {
            let skip_items=['&nbsp;','<span>','</span>','\''];
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
        $scope.count = 0;
        $scope.isSend = false;
        $scope.message_error = false;
        $scope.onChangeMessage = function () {
            $scope.message_error = false;
        };
        $scope.sendMessage = async function () {
            let message =  prepareData($scope.message);
            if($scope.message.replace(' ','')==='' ||
                typeof $scope.message==='undefined'){
                $scope.message_error = true;
            }else {
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "broadcast",
                        data: 'message=' + message,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    $scope.isSend = true;
                    console.log('Message sent to :');
                    console.log(result.data.sent_users);
                    $scope.count = result.data.sent_users.length;
                    $scope.$apply();
                } catch (err) {
                    if (err.status === 401) {
                        AuthService.Logout();
                        $location.path('/');
                    }
                }
            }
        }
    }
]);