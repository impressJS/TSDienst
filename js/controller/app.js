//
//PostenController
//
app.controller('PostenController', [
    '$scope', 'postenService',
    function($scope, postenService) {

        $scope.items = postenService.getItems();
        $scope.co = postenService.getCustomer();
        $scope.cl = postenService.getClient();
        console.log($scope.items);
        $scope.createObjPosten = function(item) {
            return  {
                'tbPostenDate': item.postenDatum,
                'tbPostenText': item.postenText,
                'tbPostenProStd': item.postenProStd,
                'tbPostenStdAnz': item.postenStdAnz
            };
        };
        $scope.$on('handleEmit', function(event, args) {
            $scope.postenDatum = args.message;
        });
        $scope.addPosten = function(item) {
            item = $scope.createObjPosten(item);
            postenService.appendItem(item);
            $scope.items = postenService.getItems();
        };
        $scope.calcEndSum = function() {
            var sum = 0, el, items = postenService.getItems();
            for (el in items) {
                sum += items[el].tbPostenProStd * items[el].tbPostenStdAnz;
            }
            return parseFloat(sum);
        };
        $scope.delete = function(itemId) {
            postenService.deleteItem(itemId);
            $scope.items = postenService.getItems();
        };
        $scope.changeAddresses = function() {
            postenService.setCustomer($scope.co);
            postenService.setClient($scope.cl);
        }
        $scope.disableAnker = function() {
            var css;
            if ($scope.items.length === 0) {
                css = {
                    'color': 'red',
                    'pointer-events': 'none'};
            } else {
                css = {'pointer-events': 'auto'};
            }
            return css;
        };
    }]);
//
//PrintController
//
app.controller('PrintController', [
    '$scope', '$rootScope', 'postenService',
    function($scope, $rootScope, postenService) {
        $scope.items = postenService.getItems();
        $scope.co = postenService.getCustomer();
        $scope.cl = postenService.getClient();
        $rootScope.printMode = true;
    }]);
//
//ScreenController
//
app.controller('ScreenController', [
    '$scope', '$rootScope', 'postenService',
    function($scope, $rootScope, postenService) {
        $rootScope.printMode = false;
    }]);
//
//EditController
//
app.controller('EditController', [
    '$scope', '$routeParams', 'postenService',
    function($scope, $routeParams, postenService) {
        var item, itemNr;
        itemNr = $routeParams.itemNr;
        item = postenService.getItem(itemNr);
        $scope.item = {
            'postenDatum': item.tbPostenDate.toLocaleDateString(),
            'postenText': item.tbPostenText,
            'postenProStd': item.tbPostenProStd,
            'postenStdAnz': item.tbPostenStdAnz
        };
        function changePosten() {
            item = $scope.createObjPosten(itemNr);
            postenService.appendItem(item);
            $scope.items = postenService.getItems();
        }
    }]);
