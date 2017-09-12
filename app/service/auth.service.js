/**
 * Created by prasanna_d on 9/12/2017.
 */
angular.module('chat-bot-app')
    .factory('AuthService',[
        '$localStorage','$location','$http',
        function ($localStorage, $location, $http) {
            let isLogin = false;

            let service = {};
            service.getToken = getToken;
            service.Login = login;
            service.Logout = logout;
            service.getUser = getUser;
            service.isLoginStatus = isLoginStatus;
            service.setIsLogin = setIsLogin;
            return service;

            //For Watchers in other controllers
            function isLoginStatus() {return isLogin;}

            //setter method for isLogin flag
            function setIsLogin(flag) {isLogin=flag;}

            function getUser() {
                if($localStorage.currentUser){return $localStorage.currentUser;
                }else{isLogin = false;return null;}
            }

            function login(username,auth_token,callback) {
                try {
                    $localStorage.currentUser = {
                        username: username,
                        token: auth_token
                    };
                    $http.defaults.headers.common.Authorization = 'Bearer ' + auth_token;
                    isLogin = true;
                    callback(true);
                }catch  (err){
                    console.log(err);
                    isLogin = true;
                    console.log('error writing local storage');
                    callback(false);
                }
            }
            function getToken(){
                if($localStorage.currentUser){
                    return $localStorage.currentUser.token;}
                $location.path('/');
                return '';
            }
            function logout() {
                isLogin = false;
                delete $localStorage.currentUser;
            }
        }
    ]);

