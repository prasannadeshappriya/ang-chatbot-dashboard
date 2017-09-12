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
                $scope.values = result.data.data.values;
                $scope.$apply();
            }else{
                $scope.message = 'Error occurred!';
                $scope.dangerAlert = true;
                $scope.$apply();
            }
        }
    }
]);