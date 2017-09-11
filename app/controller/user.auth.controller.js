/**
 * Created by prasanna_d on 9/11/2017.
 */
app.controller('UserAuthController',[
    '$scope','$http',
    function ($scope,$http) {
        $scope.test = [{values: 'prasanna', expressions: ["i eat rice","movies","animals"]},{values: 'deshappriya', expressions: ["i love nature","my pets"]}];
        $scope.test2 = [["i eat rice","movies","animals"], ["i love nature","my pets"]];
        $scope.onInit = function () {
            console.log('Initialize User Auth View');
        };
        $scope.testbtn = function () {
            console.log($scope.test);
            console.log($scope.test2);
        };
    }
]);