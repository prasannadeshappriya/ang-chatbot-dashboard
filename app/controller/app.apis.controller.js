/**
 * Created by prasanna_d on 11/27/2017.
 */
app.controller('AppAPIController',[
    '$scope','$http', 'host_url',
    function($scope, $http, host_url){
        //Error messages section----------------------------------------------------------------------------------------
        $scope.api_name_error = false;
        //Success and Fail Icons
        $scope.isSuccess = false;
        $scope.isError = false;

        //page loading
        $scope.pageLoading = false;

        $scope.isSaving = false;
        $scope.api_url_error = false;
        $scope.key_error = false;
        $scope.api_method_error = false;
        $scope.request_error = false;
        $scope.changeText = function (field) {
            switch (field){
                case 'api_name_error':
                    $scope.api_name_error = false;
                    break;
                case 'api_url_error':
                    $scope.api_url_error = false;
                    break;
                case 'api_method_error':
                    $scope.api_method_error = false;
                    break;
            }
        };
        //--------------------------------------------------------------------------------------------------------------
        $scope.stored_apis = [];
        $scope.onInit = async function(){
            console.log('App API View Initialized');
            $scope.stored_apis = [];
            $scope.pageLoading = true;
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "api/getAllAPIs"
                });
                if (result.status === 200) {
                    let data = result.data.data;
                    for(let i=0; i<data.length; i++){
                        try {
                            let tmpData = JSON.parse(data[i].connection_data);
                            $scope.stored_apis.push(tmpData);
                        }
                        catch (err){}
                    }
                    $scope.pageLoading = false;
                    $scope.$apply();
                }
            }catch (err){
                $scope.pageLoading = false;
            }
            //clear loading flag
            $scope.isLoading = false;
            $scope.apiMethod = "GET";
        };
        //--------------------------------------------------------------------------------------------------------------
        $scope.data = {};
        $scope.headers = {};
        $scope.addData = function () {
            if($scope.apiData !== '' &&
                    typeof $scope.apiData !== 'undefined'){
                let input = $scope.apiData.split("=");
                let con = true;
                if(input.length<2){con = false;}
                else{
                    Object.keys($scope.data)
                        .forEach(function (key) {
                            if(key===input[0]){
                                con = false;
                            }
                        })
                }
                if(con){
                    $scope.apiData = '';
                    $scope.data[input[0]] = input[1];
                }
            }
        };

        function removeSpacesInArray(arrInput, isData){
            let tmpArr = [];
            for(let i=0; i<arrInput.length; i++){
                let value = arrInput[i]; let newValue = '';
                let valueArr = value.split(" ");
                for(let j=0; j<valueArr.length; j++) {
                    if(newValue===''){newValue = valueArr[j];}
                    else{newValue = newValue + valueArr[j];}
                }
                tmpArr.push(newValue.toLowerCase());
            }
            return tmpArr;
        }
        $scope.addHeader = function () {
            if($scope.apiHeader !== '' &&
                typeof $scope.apiHeader !== 'undefined'){
                let input = $scope.apiHeader.split("=");
                let con = true;
                if(input.length<2){con = false;}
                else{
                    input = removeSpacesInArray(input);
                    Object.keys($scope.headers)
                        .forEach(function (key) {
                            if(key===input[0]){
                                con = false;
                            }
                        })
                }
                if(con){
                    $scope.apiHeader = '';
                    $scope.headers[input[0]] = input[1];
                }
            }
        };
        //Status variables for messages---------------------------------------------------------------------------------
        $scope.validate_status_message = '';
        $scope.key_error = '';
        $scope.api_response = '';
        $scope.save_message = '';
        $scope.isValidating = false;
        //Validate------------------------------------------------------------------------------------------------------
        $scope.btnValidate = async function(){
            let con = true;
            if(typeof $scope.apiName==='undefined' ||
                    $scope.apiName===''){
                $scope.api_name_error = true; con = false;
            }
            if(typeof $scope.apiMethod==='undefined' ||
                $scope.apiMethod===''){
                $scope.api_method_error = true; con = false;
            }
            if(typeof $scope.apiURL==='undefined' ||
                $scope.apiURL===''){
                $scope.api_url_error = true; con = false;
            }
            if(con){
                $scope.isValidating = true;
                $scope.validate_status_message = "Validating...";
                $scope.api_response = '';

                let request = {
                    method: $scope.apiMethod,
                    url: $scope.apiURL
                };

                let headers = $scope.headers;
                let data;
                let isContentTypeAvailable = false;
                Object.keys(headers)
                    .forEach(function (key) {
                        if(key==='content-type'){
                            isContentTypeAvailable = true;
                        }
                    });
                if(isContentTypeAvailable){
                    if(headers['content-type'] === 'application/json'){
                        data = $scope.data;
                        request['data'] = data;
                    }else if(headers['content-type'] === 'application/x-www-form-urlencoded'){
                        Object.keys($scope.data)
                            .forEach(function (key) {
                                if(data){data = data + '&' + key + '=' + $scope.data[key];}
                                else{data = key + '=' + $scope.data[key];}
                            });
                        request['data'] = data;
                    }
                }else{
                    headers['content-type'] = 'application/json';
                    data = $scope.data;
                }

                request['headers'] = $scope.headers;

                try {
                    let result = await $http(request);
                    try {
                        $scope.api_response = JSON.stringify(result.data);
                    }catch (err){
                        $scope.api_response = result.data;
                    }
                    $scope.isValidating = false;

                    //Shoe the image [success]
                    $scope.isSuccess = true;
                    $scope.isError = false;

                    $scope.request_error = false;
                    $scope.validate_status_message = "Validation completed";
                    $scope.$apply();
                }catch (err){
                    let error = 'Status: ' + err.status + ', ' +
                            'Data: ' + JSON.stringify(err.data) + ', ' +
                            'statusText: ' + err.statusText;
                    $scope.api_response = error;
                    $scope.isValidating = false;

                    //Shoe the image [success]
                    $scope.isSuccess = false;
                    $scope.isError = true;
                    $scope.request_error = true;
                    $scope.validate_status_message = "Error on validation";

                    if($scope.isUpdate){
                        $scope.cancelUpdate();
                        $scope.validate_status_message = "Cannot connect to the API. [connection_error]";
                    }
                    $scope.$apply();
                }
            }
        };

        $scope.ItemClick = async function(type, key){
            if(type==='data'){
                delete $scope.data[key];
            }else if (type==='header'){
                delete $scope.headers[key];
            }
        };

        $scope.btnAddKey = async function(key){
            $scope.key_error = false;
            $scope.key_error = '';
            try{
                let document = JSON.parse($scope.api_response);
                $scope.api_output = document[key];
            }catch (err){
                $scope.key_error = true;
                $scope.key_error_message = 'Response is not in correct format [Json/Parse error]';
            }
        };

        $scope.resetValidation = function () {
            $scope.isValidating = false;
            $scope.isSuccess = false;
            $scope.isError = false;
            $scope.validate_status_message = '';
        };

        $scope.btnSaveAPI = async function(key){
            //clear the save error flag
            $scope.save_message = 'Saving API ...';
            $scope.isSaving = true;

            //Validation
            if(!$scope.isSuccess){
                $scope.isSaving = false;
                $scope.save_message = 'Validate the API before start saving process.';
                return;
            }

            if(typeof key==='undefined' || key===''){
                $scope.isSaving = false;
                $scope.save_message = 'Key is required to get the data from the API response.';
                return;
            }
            try{
                let document = JSON.parse($scope.api_response);
                if(typeof document[key]==='undefined' ||
                        document[key]===''){
                    $scope.isSaving = false;
                    $scope.save_message = 'Cannot find any values for provided key. [Key_Error]';
                    return;
                }
            }catch (err){
                $scope.isSaving = false;
                $scope.save_message = 'Response is not in correct format [Json/Parse error]';
                return;
            }

            //collect and print the information for testing
            let dataString = {
                apiName:  $scope.apiName,
                apiMethod: $scope.apiMethod,
                apiURL: $scope.apiURL,
                apiData: $scope.data,
                apiHeaders: $scope.headers,
                apiResponseKey: key
            };

            try{
                //send the values to the server to store api information in the database
                //database call
                if($scope.isUpdate){
                    //Update process
                    let isChanged = false;
                    let apiName;
                    if(typeof $scope.oldItem==='undefined'){return;}
                    for(let i=0; i<$scope.stored_apis.length; i++){
                        if($scope.oldItem===$scope.stored_apis[i]){
                            isChanged = true;
                            apiName = $scope.oldItem.apiName;
                            $scope.stored_apis.splice(i,1);
                            $scope.stored_apis.push(dataString);
                            break;
                        }
                    }
                    //send stored_apis to the server
                    //server call
                    if(isChanged){
                        //server call
                        try {
                            let result = await $http({
                                method: "POST",
                                url: host_url + "api/updateAPI",
                                data: 'connection_data=' + JSON.stringify(dataString) + '&apiName=' + apiName,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            });
                            if(result.status===200) {
                                $scope.save_message = '';
                                $scope.isSaving = false;

                                //Reset the text fields and other variables to default
                                clear();
                                $scope.$apply();
                            }else{
                                console.log('API update failed, Error!');
                                $scope.$apply();
                            }
                        }catch (err){
                            console.log('API update failed, Error!');
                            $scope.$apply();
                        }
                    }
                }else{
                    //create new API process
                    //validation for similar name
                    for(let i=0; i<$scope.stored_apis.length; i++){
                        if(dataString.apiName===$scope.stored_apis[i].apiName){
                            $scope.isSaving = false;
                            $scope.save_message = 'Cannot create two APIs with the same name. API name must be unique';
                            return;
                        }
                    }
                    //server call
                    try {
                        let result = await $http({
                            method: "POST",
                            url: host_url + "api/createApi",
                            data: 'connection_data=' + JSON.stringify(dataString),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        if(result.status===201) {
                            //Add new API to the array
                            $scope.stored_apis.push(dataString);

                            $scope.save_message = '';
                            $scope.isSaving = false;

                            //Reset the text fields and other variables to default
                            clear();
                            $scope.$apply();
                        }else{
                            console.log('API create failed, Error!');
                            $scope.$apply();
                        }
                    }catch (err){
                        console.log('API create failed, Error!');
                        $scope.$apply();
                    }
                }
            }catch (err){
                console.log(err);
                $scope.isSaving = false;
                $scope.save_message = 'Something went wrong while saving API.';
            }
        };

        function clear() {
            $scope.apiName = '';
            $scope.apiURL = '';
            $scope.data = {};
            $scope.headers = {};
            $scope.api_response='';
            $scope.isSaving = false;
            $scope.save_message = '';
            $scope.apiKeyField = '';
            $scope.api_output = '';
            $scope.resetValidation();
        }

        //Track the edit/update process
        $scope.isUpdate = false;
        $scope.oldItem = null;

        $scope.storedApiOnclick = async function(item){
            if(typeof item!=='undefined'){
                //clear
                clear();

                //set the old item
                $scope.isUpdate = true;
                $scope.oldItem = item;

                //set other variables
                $scope.apiName = item.apiName;
                $scope.apiMethod = item.apiMethod;
                $scope.apiURL = item.apiURL;
                $scope.data = item.apiData;
                $scope.headers = item.apiHeaders;
                $scope.apiKeyField = item.apiResponseKey;

                //start validate process
                await $scope.btnValidate();

                //set the key and get the value from the response json
                await $scope.btnAddKey(item.apiResponseKey);

                //apply changes to the $scope
                $scope.$apply();
            }
        };

        $scope.cancelUpdate = async function () {
            //set the old item
            $scope.isUpdate = false;
            $scope.oldItem = null;
            clear();
        };

        $scope.deleteAPI = async function () {
            $scope.isSaving = true;
            $scope.save_message = 'Deleting API ...';

            let isDeleted = false;
            let apiName;

            if(typeof $scope.oldItem==='undefined'){return;}
            for(let i=0; i<$scope.stored_apis.length; i++){
                if($scope.oldItem===$scope.stored_apis[i]){
                    $scope.stored_apis.splice(i,1);
                    isDeleted = true;
                    apiName = $scope.oldItem.apiName;
                    break;
                }
            }

            if(isDeleted) {
                //database call [Server]
                try {
                    let result = await $http({
                        method: "POST",
                        url: host_url + "api/deleteAPI",
                        data: 'apiName=' + apiName,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    $scope.isSaving = false;
                    $scope.save_message = '';
                    //clear
                    clear();
                    //set the old item to null
                    $scope.isUpdate = false;
                    $scope.oldItem = null;
                    $scope.$apply();
                }catch (err){
                    console.log('Error removing api from the database');
                    $scope.isSaving = false;
                    $scope.save_message = '';
                    //clear
                    clear();
                    //set the old item to null
                    $scope.isUpdate = false;
                    $scope.oldItem = null;
                    $scope.$apply();
                }
            }
        }
    }
]);