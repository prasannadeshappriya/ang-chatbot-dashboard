/**
 * Created by prasanna on 9/10/17.
 */
app.controller('AppEntitiesViewController',[
    '$scope','$http','AppEntitiesService','host_url',
    function ($scope,$http, AppEntitiesService, host_url) {
        function prepareData(data) {
            let skip_items=['&nbsp;','<span>','</span>'];
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
        //--------------------------------------------------------------------------------------------------------------
        $scope.isWitEntity = false;
        //Watcher functions---------------------------------------------------------------------------------------------
        $scope.entities = [];
        $scope.$watch(AppEntitiesService.getAppEntities, async function (newValue) {
            if(newValue){
                if(typeof newValue!=='undefined'){
                    $scope.entities = [];
                    for (let i=0; i<newValue.length; i++){
                        if(newValue[i]!=='Custom' && newValue[i]!=='intent'){$scope.entities.push(newValue[i])}
                    }
                }
                if(typeof newValue[0]!=='undefined' &&
                    newValue[0]!=='') {
                    await $scope.onItemClick(newValue[0]);
                }
            }
        },true);
        //Model---------------------------------------------------------------------------------------------------------
        let selected_item;
        $scope.entityItemClick = function(item){
            $scope.isCreateNewEntity = false;
            $scope.selectedappEntity = angular.copy(item);
            selected_item = item;
            //Clear all error flags
            $scope.value_error = false;
            $scope.data_error = false;
            $scope.value_duplicate_error = false;
            $scope.isLoadingModel = false;
        };
        $scope.btn_update_add_expressions = function () {
            if(typeof $scope.intUpdateExpression!=='undefined' &&
                $scope.intUpdateExpression!=='') {
                if ($scope.selectedappEntity.expressions.indexOf($scope.intUpdateExpression)===-1){
                    $scope.selectedappEntity.expressions.push($scope.intUpdateExpression);
                    $scope.intUpdateExpression = '';
                }
            }
        };
        $scope.appEntityUpdateItemClick = function (item) {
            let i = $scope.selectedappEntity.expressions.indexOf(item);
            if(i!==-1){$scope.selectedappEntity.expressions.splice(i,1);}
        };
        //Error flags---------------------------------------------------------------------------------------------------
        $scope.reset_error_flag = function (error) {
            switch (error){
                case 'value_error':
                    $scope.value_error = false;
                    break;
                case 'data_error':
                    $scope.data_error = false;
                    break;
                case 'value_duplicate_error':
                $scope.value_duplicate_error = false;
                break;
            }
        };
        $scope.isSubmit = false;
        $scope.value_duplicate_error = false;
        $scope.data_error = false;
        $scope.wit_data_error = false;
        //--------------------------------------------------------------------------------------------------------------
        $scope.appEntityItemDelete = async function (isWitEntity) {
            $scope.isSubmit = true;
            $scope.isLoadingModel = true;
            if(isWitEntity){
                try{
                    let result = await $http({
                        method: "POST",
                        url: host_url + "wit/deleteWitData",
                        data: 'entity_data=' + JSON.stringify($scope.selectedWitData),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    if(result.status===200){
                        for (let i = 0; i < $scope.wit_value_array.length; i++) {
                            if ($scope.wit_value_array[i].id === $scope.selectedWitData.id &&
                                $scope.wit_value_array[i].entity_id === $scope.selectedWitData.entity_id &&
                                $scope.wit_value_array[i].value === $scope.selectedWitData.value) {
                                $scope.wit_value_array.splice(i, 1); $scope.$apply(); break;
                            }
                        }
                    }
                }catch (err){console.log(err);}
                $scope.selectedWitData = {id:'', entity_id: '', value: 'wit', data: ''};
                $scope.isLoadingModel = false;
                $('#updateWitData').modal('hide');
            }else {
                if (!$scope.isCreateNewEntity && selected_item) {
                    for (let i = 0; i < $scope.values.length; i++) {
                        if ($scope.values[i] === selected_item) {
                            $scope.values.splice(i, 1);
                            break;
                        }
                    }
                    let data = JSON.stringify($scope.values, function (key, value) {
                        if (key === "$$hashKey" || key === "data") {
                            return undefined;
                        }
                        return value;
                    });
                    let result = await $http({
                        method: "POST",
                        url: host_url + "entity/delete",
                        data: 'entity_name=' + $scope.entityName + '&entity_value=' + $scope.selectedappEntity.value,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    if (result.status === 200) {
                        result = await $http({
                            method: "POST",
                            url: host_url + "wit/putEntityById",
                            data: 'entity_name=' + $scope.entityName + '&wit_values=' + data + '&wit_doc=' + $scope.entityDescription,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                    }
                    $scope.message = 'Intent successfully deleted!';
                    $scope.successAlert = true;
                    $scope.$apply();
                    $('#updateEntityData').modal('hide');
                }
            }
        };
        $scope.appEntityItemUpdate = async function (isWitEntity) {
            $scope.isSubmit = true;
            $scope.isLoadingModel = true;
            console.log($scope.wit_value_array);
            if(isWitEntity){
                let con = true;
                if(typeof $scope.selectedWitData.data==='undefined' ||
                    ($scope.selectedWitData.data).replace(' ','') === ''){
                    $scope.wit_data_error = true; con = false;
                }
                if(con) {
                    console.log($scope.selectedWitData);
                    try {
                        let result = await $http({
                            method: "POST",
                            url: host_url + "wit/updateWitData",
                            data: 'entity_data=' + JSON.stringify($scope.selectedWitData),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                        if(result.status===200){
                            if($scope.selectedWitData.isNew){
                                let new_item = result.data.message;
                                $scope.wit_value_array.push(new_item);
                                $scope.$apply();
                            }else {
                                for (let i = 0; i < $scope.wit_value_array.length; i++) {
                                    if ($scope.wit_value_array[i].id === $scope.selectedWitData.id &&
                                        $scope.wit_value_array[i].entity_id === $scope.selectedWitData.entity_id &&
                                        $scope.wit_value_array[i].value === $scope.selectedWitData.value) {
                                        $scope.wit_value_array.splice(i, 1);
                                        $scope.wit_value_array.push($scope.selectedWitData);
                                        $scope.$apply();
                                        break;
                                    }
                                }
                            }
                            location.reload();
                        }
                    }catch (err){console.log(err);}
                    $scope.selectedWitData = {id:'', entity_id: '', value: 'wit', data: ''};
                    $scope.isLoadingModel = false;
                    $('#updateWitData').modal('hide');
                }
                $scope.isLoadingModel = false;
            }else {
                let con = true;
                if ($scope.isCreateNewEntity) {
                    if ($scope.selectedappEntity.value.replace(" ", "") === '' ||
                        typeof $scope.selectedappEntity.value === 'undefined') {
                        $scope.value_error = true;
                        con = false;
                    }
                    for (let i = 0; i < $scope.values.length; i++) {
                        if ($scope.values[i].value === $scope.selectedappEntity.value) {
                            $scope.value_duplicate_error = true;
                            con = false;
                            break;
                        }
                    }
                }
                if ($scope.selectedappEntity.data.replace(" ", "") === '' ||
                    typeof $scope.selectedappEntity.data === 'undefined') {
                    $scope.data_error = true;
                    con = false;
                }
                if (con) {
                    if (selected_item) {
                        for (let i = 0; i < $scope.values.length; i++) {
                            if ($scope.values[i] === selected_item) {
                                $scope.values.splice(i, 1);
                                $scope.values.splice(i, 0, $scope.selectedappEntity);
                                break;
                            }
                        }
                    } else {
                        $scope.values.push($scope.selectedappEntity);
                    }
                    let data = JSON.stringify($scope.values, function (key, value) {
                        if (key === "$$hashKey" || key === "data") {
                            return undefined;
                        }
                        return value;
                    });
                    if (typeof $scope.entityDescription === 'undefined') {
                        $scope.entityDescription = '';
                    }

                    let result = await $http({
                        method: "POST",
                        url: host_url + "entity/update",
                        data: 'entity_name=' + $scope.entityName + '&entity_value=' + $scope.selectedappEntity.value +
                        '&entity_data=' + prepareData($scope.selectedappEntity.data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    if (result.status === 201) {
                        result = await $http({
                            method: "POST",
                            url: host_url + "wit/putEntityById",
                            data: 'entity_name=' + $scope.entityName + '&wit_values=' + data + '&wit_doc=' + $scope.entityDescription,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });
                    }

                    $scope.message = 'Intent successfully updated!';
                    $scope.successAlert = true;
                    $scope.$apply();
                    $('#updateEntityData').modal('hide');
                }
            }
        };
        $scope.onClickWitEntityData = function(isNewData,item){
            if(isNewData){
                $scope.isCreateNewWitEntity = true;
                $scope.selectedWitData = {id:'', entity_id: '', value: 'wit', data: ''};
                $scope.selectedWitData.data = ' ';
                $scope.selectedWitData.entityName = $scope.entityName;
                $scope.selectedWitData.isNew = true;
            }else{
                $scope.isCreateNewWitEntity = false;
                $scope.selectedWitData = angular.copy(item);
                let oldItemWitData = angular.copy(item.data);
                $scope.selectedWitData.isNew = false;
                $scope.selectedWitData.entityName = $scope.entityName;
                $scope.selectedWitData.oldItemWitData = oldItemWitData;
                console.log($scope.selectedWitData);
            }
        };
        $scope.isCreateNewWitEntity = false;
        $scope.isCreateNewEntity = false;
        $scope.add = function () {
            $scope.isCreateNewEntity = true;
            $scope.selectedappEntity = {value: '', expressions: [], data: ''};
            selected_item = null;
            //Clear all error flags
            $scope.value_error = false;
            $scope.data_error = false;
            $scope.value_duplicate_error = false;
            $scope.isLoadingModel = false;
        };
        //Entity details------------------------------------------------------------------------------------------------
        $scope.entityName = '';
        $scope.entityDescription = '';
        $scope.lookup = [];
        $scope.values = [];
        //--------------------------------------------------------------------------------------------------------------
        $scope.onInit = function () {
            console.log('Initialize App Entity View')
        };
        //Loading flag--------------------------------------------------------------------------------------------------
        $scope.isLoading = false;
        $scope.isLoadingDelete = false;
        $scope.isLoadingModel = false;
        //--------------------------------------------------------------------------------------------------------------
        $scope.onItemClick = async function (item) {
            $scope.isLoading = true;
            item = item.replace('/','$');
            try {
                let result = await $http({
                    method: "GET",
                    url: host_url + "wit/getEntityById?entity_name=" + item
                });
                if (item.includes('wit$')) {
                    $scope.isWitEntity = true;
                    $scope.wit_value_array = result.data.values;
                }
                else {$scope.isWitEntity = false;}
                $scope.isLoading = false;
                if (result.status === 200) {
                    $scope.entityName = result.data.data.name;
                    try {
                        let json_string = JSON.parse(result.data.data.doc);
                        $scope.entityDescription = json_string.long_desc;
                    } catch (err) {
                        $scope.entityDescription = result.data.data.doc;
                    }
                    $scope.lookup = result.data.data.lookups;
                    let val = result.data.data.values;
                    let data = result.data.values;
                    if (typeof val !== 'undefined') {
                        for (let i = 0; i < val.length; i++) {
                            let item = val[i], con = true;
                            if (data) {
                                for (let j = 0; j < data.length; j++) {
                                    if (item.value === data[j].value) {
                                        item.data = data[j].data;
                                        con = false;
                                        break;
                                    }
                                }
                            }
                            if (con) {item.data = ''}
                        }
                    }
                    $scope.values = result.data.data.values;
                    $scope.$apply();
                } else {
                    $scope.message = 'Error occurred!';
                    $scope.dangerAlert = true;
                    $scope.$apply();
                }
            }catch (err){
                $scope.message = 'Error occurred!';
                $scope.dangerAlert = true;
                $scope.$apply();
            }
        };
        $scope.delete = async function () {
            $scope.isLoadingDelete = true;
            let result = await $http({
                method: "POST",
                url: host_url + "wit/deleteEntity",
                data: 'entity_name='+  $scope.entityName,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            let index = $scope.entities.indexOf($scope.entityName);
            if(index!==-1){$scope.entities.splice(index,1);}
            $scope.isLoadingDelete = false;
            if($scope.entities.length>0){$scope.onItemClick($scope.entities[0]);}
            else{location.reload();}
            $scope.isLoadingDelete = false;
            $scope.$apply();
            console.log(result);
        }
    }
]);