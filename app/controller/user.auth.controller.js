/**
 * Created by prasanna_d on 9/11/2017.
 */
app.controller('UserAuthController',[
    '$scope','$http','AuthService','host_url','$location',
    function ($scope,$http,AuthService,host_url,$location) {
        $scope.onInit = function () {
            console.log('Initialize User Auth View');
        };
        //Error flags-----------------------------------------------------
        $scope.errorReset = function (type) {
            switch (type){
                case 'login_username_error':
                    $scope.login_username_error = '';
                    break;
                case 'login_password_error':
                    $scope.login_password_error = '';
                    break;
                case 'reg_username_error':
                    $scope.reg_username_error = '';
                    break;
                case 'reg_password_error':
                    $scope.reg_password_error = '';
                    break;
            }
        };
        //----------------------------------------------------------------
        //Password validation--------------------------------------
        $scope.rePasswordValidate = function () {
            if(typeof $scope.reg_re_password==='undefined' ||
                $scope.reg_re_password===''){$scope.reg_re_password_error = ''; return;}
            if($scope.reg_password!==$scope.reg_re_password){
                $scope.reg_re_password_error = 'Confirmed password is not match with your password';
            }else{$scope.reg_re_password_error = '';}
        };
        //----------------------------------------------------------------
        $scope.btnSignIn = async function () {
            //Show the errors when only sign in button pressed
            $scope.isSignInClicked = true;
            $scope.login_error_flag = false;
            let con = true; //Validation flag
            if($scope.login_username==='' ||
                typeof $scope.login_username==='undefined') {
                $scope.login_username_error = 'Username is required'; con = false;
            }
            if($scope.login_password==='' ||
                typeof $scope.login_password==='undefined') {
                $scope.login_password_error = 'Password is required'; con = false;
            }
            if(con){
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "user/login",
                        data: 'username=' + $scope.login_username + '&password=' + $scope.login_password,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    if(result.status===200){
                        AuthService.Login(
                            result.data.username,
                            result.data.token,
                            function (callback) {
                                console.log('done');
                                $location.path('/dashboard');
                                $scope.$apply();
                            });
                    }else{
                        console.log('Unknown Error: ');
                        console.log(result);
                        $scope.login_error_flag = true;
                        $scope.login_error_messages = 'Error occurred while communicate with the server, Try again!';
                        $scope.$apply();
                    }
                }catch(err){
                    if(err.status===401){
                        $scope.login_error_flag = true;
                        $scope.login_error_messages = 'Username or password is invalid';
                        $scope.$apply();
                    }if(err.status===400){
                        $scope.login_error_flag = true;
                        $scope.login_error_messages = 'Username or password is invalid';
                        $scope.$apply();
                    }else{
                        console.log('Unknown Error: ');
                        console.log(err);
                        $scope.login_error_flag = true;
                        $scope.login_error_messages = 'Server Error';
                        $scope.$apply();
                    }
                }
            }
        };
        $scope.btnSignUp = async function () {
            //Show the errors when only sign up button pressed
            $scope.isSignUpClicked = true;
            $scope.reg_error_flag = false;
            let con = true; //Validation flag
            if($scope.reg_username==='' ||
                typeof $scope.reg_username==='undefined') {
                $scope.reg_username_error = 'Username is required'; con = false;
            }
            if($scope.reg_password==='' ||
                typeof $scope.reg_password==='undefined') {
                $scope.reg_password_error = 'Password is required'; con = false;
            }
            if($scope.reg_re_password==='' ||
                typeof $scope.reg_re_password==='undefined') {
                $scope.reg_re_password_error = 'Confirm your password by typing it again'; con = false;
            }
            if(!con){return;}
            //Password Validation-------------
            let password = $scope.reg_password;
            let escape_char = ['<','>'];
            function isSimpleChar(chr) {
                if(/^[a-zA-Z]+$/.test(chr)){
                    return (chr===chr.toLowerCase());} else{return false;}}
            function isCapitalChar(chr) {
                if(/^[a-zA-Z]+$/.test(chr)){
                return (chr===chr.toUpperCase());} else{return false;}}
            if(password.length<8){$scope.reg_password_error = 'Password should at least contain 8 letters';return;}
            let has_invalid_chr = false; let has_capital_chr = false;
            let has_simple_chr = false; let has_number_chr = false;
            for(let i=0; i<password.length; i++){
                if(escape_char.indexOf(password[i])!==-1){has_invalid_chr=true;}
                if(isCapitalChar(password[i])){has_capital_chr = true;}
                if(isSimpleChar(password[i])){has_simple_chr = true;}
                if(!isNaN(parseInt(password[i]))){has_number_chr = true;}
            }
            if(has_invalid_chr){$scope.reg_password_error = 'Invalid password';return;}
            let message = 'Password should contain at least one ';
            let pass_error=[];
            if(!has_capital_chr){pass_error.push('capital letter')}
            if(!has_simple_chr){pass_error.push('simple letter')}
            if(!has_number_chr){pass_error.push('number')}
            //Create an error message
            if(pass_error.length===3){message = message + pass_error[0] + ', ' + pass_error[1] + ' and ' + pass_error[2];}
            else if(pass_error.length===2){message = message + pass_error[0] + ' and ' + pass_error[1];}
            else if(pass_error.length===1){message = message + pass_error[0];}
            if(pass_error.length>0){$scope.reg_password_error = message;return;}
            //--------------------------------
            if($scope.reg_password!==$scope.reg_re_password){con = false;}
            if(con){
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "user/create",
                        data: 'username=' + $scope.reg_username + '&password=' + $scope.reg_password,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    console.log(result);
                    if(result.status===201){
                        AuthService.Login(
                            result.data.username,
                            result.data.token,
                            function (callback) {
                                console.log('done');
                                $location.path('/dashboard');
                                $scope.$apply();
                            });
                    }else{
                        console.log('Unknown Error: ');
                        console.log(result);
                        $scope.login_error_flag = true;
                        $scope.login_error_messages = 'Error occurred while communicate with the server, Try again!';
                        $scope.$apply();
                    }
                }catch(err){
                    console.log(err);
                    if(err.status===409){
                        $scope.reg_error_flag = true;
                        $scope.reg_error_messages = 'User already exist on the server';
                        $scope.$apply();
                    }if(err.status===400){
                        $scope.login_error_flag = true;
                        $scope.reg_password_error = 'Invalid password';
                        $scope.$apply();
                    }else{
                        console.log('Unknown Error: ');
                        console.log(err);
                        $scope.login_error_flag = true;
                        $scope.login_error_messages = 'Server Error';
                        $scope.$apply();
                    }
                }
            }
        };
    }
]);