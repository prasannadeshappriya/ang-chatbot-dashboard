/**
 * Created by prasanna_d on 8/30/2017.
 */
app.controller('mainController',[
    '$scope', '$http','AuthService', 'host_url','PageViewService','$location',
    function ($scope,$http,AuthService,host_url,PageViewService,$location) {
        //-----------------------Views Section--------------------------------------------------------------------------
        $scope.viewController = {
            intent: true, settings: false,
            entity: false, training: false,
            app_entities: false, help: false, app_apis: false
        };
        $scope.$watch(PageViewService.getViewController, function (newValue) {
            if(newValue){
                $scope.viewController = newValue;
            }
        },true);
        $scope.showView = function (view_name) {
            PageViewService.setViewController(view_name);
        };
        //--------------------------------------------------------------------------------------------------------------
        //User Authentication-------------------------------------------------------------------------------------------
        $scope.admin_user_name = '';
        $scope.isAuthanticated = false;
        $scope.$watch(AuthService.isLoginStatus, function (newValue) {
            if(typeof newValue==='undefined'){
                $scope.isAuthanticated = false;
            }else if(newValue){
                $scope.isAuthanticated = newValue;
                let user = AuthService.getUser();
                if (user) {
                    $scope.admin_user_name = user.username;
                }
            }else{
                $scope.isAuthanticated = false;
            }
        },true);
        $scope.userLogOut = function () {
            AuthService.Logout();
            $http.defaults.headers.common.authorization = '';
            $location.path('/');
        }
    }
]);