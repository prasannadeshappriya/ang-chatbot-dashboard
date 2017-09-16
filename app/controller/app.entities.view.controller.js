/**
 * Created by prasanna on 9/10/17.
 */
app.controller('AppEntitiesViewController',[
    '$scope','$http','AppEntitiesService','host_url',
    function ($scope,$http, AppEntitiesService, host_url) {
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
            $scope.selectedappEntity = angular.copy(item);
            selected_item = item;
        };
        $scope.btn_update_add_expressions = function () {
            if(typeof $scope.intUpdateExpression!=='undefined' &&
                $scope.intUpdateExpression!=='') {
                if ($scope.selectedappEntity.expressions.indexOf($scope.intUpdateExpression)===-1){
                    $scope.selectedappEntity.expressions.push($scope.intUpdateExpression);
                }
            }
        };
        $scope.appEntityUpdateItemClick = function (item) {
            let i = $scope.selectedappEntity.expressions.indexOf(item);
            if(i!==-1){$scope.selectedappEntity.expressions.splice(i,1);}
        };
        $scope.isSubmit = false;
        $scope.data_error = false;
        $scope.appEntityItemUpdate = async function () {
            $scope.isSubmit = true;
            if($scope.selectedappEntity.data.replace(" ","")==='' ||
                typeof $scope.selectedappEntity.data==='undefined'){
                return $scope.data_error = true;
            }
            for(let i=0; i<$scope.values.length; i++){
                if($scope.values[i]===selected_item){
                    $scope.values.splice(i,1);
                    $scope.values.splice(i,0,$scope.selectedappEntity);
                    console.log($scope.values);
                    break;
                }
            }
            let data = JSON.stringify($scope.values, function( key, value ) {
                if( key === "$$hashKey" || key==="data" ) {return undefined;}
                return value;
            });
            if(typeof $scope.entityDescription==='undefined'){$scope.entityDescription='';}
            let result = await $http({
                method: "POST",
                url: host_url + "entity/update",
                data: 'entity_name='+  $scope.entityName + '&entity_value=' + $scope.selectedappEntity.value +
                        '&entity_data=' + $scope.selectedappEntity.data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            console.log(result);
            if(result.status===201){
                result = await $http({
                    method: "POST",
                    url: host_url + "wit/putEntityById",
                    data: 'entity_name='+  $scope.entityName + '&wit_values=' + data + '&wit_doc=' + $scope.entityDescription,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                console.log(result);
            }

            $scope.message = 'Intent successfully updated!';
            $scope.successAlert = true;
            $scope.$apply();
            $('#updateData').modal('hide');
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
        //--------------------------------------------------------------------------------------------------------------
        $scope.onItemClick = async function (item) {
            $scope.isLoading = true;
            item = item.replace('/','$');
            let result = await $http({
                method: "GET",
                url: host_url + "wit/getEntityById?entity_name=" + item
            });
            $scope.isLoading = false;
            if(result.status===200) {
                $scope.entityName = result.data.data.name;
                try {
                    let json_string = JSON.parse(result.data.data.doc);
                    $scope.entityDescription = json_string.long_desc;
                }catch (err){
                    $scope.entityDescription = result.data.data.doc;
                }
                $scope.lookup = result.data.data.lookups;
                let val = result.data.data.values;
                let data = result.data.values;
                for(let i=0; i<val.length; i++){
                    let item = val[i], con=true;
                    if(data) {
                        for (let j = 0; j < data.length; j++) {
                            if (item.value === data[j].value) {
                                item.data = data[j].data;
                                con = false;
                                break;
                            }
                        }
                    }
                    if(con){item.data = ''}
                }
                console.log(result.data.values);
                console.log(val);
                $scope.values = result.data.data.values;
                $scope.$apply();
            }else{
                $scope.message = 'Error occurred!';
                $scope.dangerAlert = true;
                $scope.$apply();
            }
        };
        $scope.delete = function () {
            console.log('delete');
        }
    }
]);