
var app = angular.module('tsRechApp', ['ngRoute', 'appControllers', 'appDirectives', 'appFilters', 'appServices']);
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);
var appFilters = angular.module('appFilters', []);
var appServices = angular.module('appServices', []);
var Data = {
    profile: {
        "Lesezirkel": [
            ["Datum", "tbPostenDate"],
            ["Beschreibung", "tbPostenText"],
            ["€/Kunde", "tbPostenProStd"],
            ["Anz. Kunden", "tbPostenStdAnz"]
        ]
    },
    items: {
        "Lesezirkel": [
            {tbPostenDate: new Date(2014, 9, 12),
                tbPostenText: "Tapezieren des Kellers",
                tbPostenProStd: 26.5,
                tbPostenStdAnz: 2},
            {tbPostenDate: new Date(2013, 9, 12),
                tbPostenText: "Weißeln des Wohnraums",
                tbPostenProStd: 9.5,
                tbPostenStdAnz: 12}
        ]
    },
    customer: {name: "T.S. Dienstleistungen",
        street: "Nelkenweg 8",
        postalCode: "D-70922",
        city: "Marktreditz"},
    client: {name: "Wochenblatt GmbH",
        street: "Frankfurter Ring 239",
        postalCode: "D-80937",
        city: "München"}
};
app.config(
        function ($routeProvider) {
            $routeProvider
                    .when('/chd_:itemNr', {templateUrl: 'view_table.html', controller: 'ChangeController'})
                    .when('/add', {templateUrl: 'view_table.html', controller: 'AddController'})
                    .otherwise({redirectTo: '/'});
        });
//
//postenService
//
appServices.service('postenService', function () {
    var usedProfileName = {};
    var usedProfileItems = {};
    this.setUsedProfile = function (profileName) {
        usedProfileName = profileName;
    }
    /**
     * Set the Profile
     * @param {obj} profileObj
     * @returns void
     */
    this.setProfile = function (profileObj) {
        Data.profile.push(profileObj);
    };
    /**
     * Set the Costumer
     * @param {obj} customerObj
     * @returns void
     */
    this.setCustomer = function (customerObj) {
        Data.customer = customerObj;
    };
    /**
     * Set the Client
     * @param {obj} clientObj
     * @returns void
     */
    this.setClient = function (clientObj) {
        Data.client = clientObj;
    };
    /**
     * Get the Profiles List
     * @returns {array}
     */
    this.getProfiles = function () {
        return Object.keys(Data.profileObj);
    };
    /**
     * Get the by this.usedProfile defined Profile
     * I use eval do avoid a Loop to search the wanted profile
     * (look up to Data .. "Lesezirkel" value is defined as key)
     * @returns {profile}
     */
    this.getProfile = function () {
        profile = eval('Data.profile.' + usedProfileName);
        return profile;
    };
    /**
     * 
     * @returns {Data.customer}
     */
    this.getCustomer = function () {
        return Data.customer;
    };
    this.getClient = function () {
        return Data.client;
    };
    /**
     * Get the by this.usedProfile assigned Items 
     * I use eval do avoid a Loop to search the wanted profile
     * (look up to Data .. "Lesezirkel" value is defined as key)
     * @returns {items}
     */
    this.getItems = function () {
        usedProfileItems = eval('Data.items.' + usedProfileName);
        return usedProfileItems;
    };
    /**
     * Get the by this.usedProfile assigned Items 
     * I use eval do avoid a Loop to search the wanted profile
     * (look up to Data .. "Lesezirkel" value is defined as key)
     * @returns {item}
     */
    this.getItem = function (id) {
        return usedProfileItems[id];
    };
    this.appendItem = function (item) {
        var vd; //void
        vd = usedProfileItems.push(item);
        return vd;
    };
    this.changeItem = function (itemNr, item) {
        item = usedProfileItems[itemNr] = item;
        return item;
    };
    this.deleteItem = function (itemNumber) {
        return usedProfileItems.splice(itemNumber, 1);
    };
    this.popItem = function () {
        return usedProfileItems.pop();
    };
});
//
//PostenController
//used in index.html to input values
//
appControllers.controller('PostenController', [
    '$scope', '$routeParams', '$location', 'postenService',
    function ($scope, $routeParams, $location, postenService) {
        var mwst = 0.15;
        $scope.initVars = function () {
            postenService.setUsedProfile('Lesezirkel');
            $scope.profile = postenService.getProfile('Lesezirkel');
            $scope.item = {};
            $scope.gesamt = {};
            $scope.items = postenService.getItems();
            $scope.co = postenService.getCustomer();
            $scope.cl = postenService.getClient();
        };
        $scope.$on('handleEmit', function (event, args) {
            $scope.postenDate = args.message;
        });
        $scope.$on('changeP', function (scope, itemNr) {
            $scope.item = postenService.getItem(itemNr);
        });
        $scope.ff=function(ee){
            return ee;
        }
        $scope.calcEndSum = function () {
            var sum = 0, el, items = postenService.getItems();
            for (el in items) {
                sum += items[el].tbPostenProStd * items[el].tbPostenStdAnz;
            }
            $scope.gesamt.sumMwst = parseFloat(sum) * mwst;
            $scope.gesamt.endBetrag = parseFloat(sum);
            return parseFloat(sum);
        };
        $scope.delete = function (itemId) {
            postenService.deleteItem(itemId);
            $scope.items = postenService.getItems();
        };
        $scope.changeAddresses = function () {
            postenService.setCustomer($scope.co);
            postenService.setClient($scope.cl);
        }
        $scope.disableAnker = function () {
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
appControllers.controller('PrintController', [
    '$scope', '$rootScope', 'postenService',
    function ($scope, $rootScope, postenService) {
        $scope.items = postenService.getItems();
        $scope.co = postenService.getCustomer();
        $scope.cl = postenService.getClient();
        $rootScope.printMode = true;
    }]);
//
//ScreenController
//
appControllers.controller('ScreenController', [
    '$scope', '$rootScope', 'postenService',
    function ($scope, $rootScope, postenService) {
        $rootScope.printMode = false;
    }]);
//
//ChangeController
//
appControllers.controller('ChangeController', [
    '$scope', '$routeParams',
    function ($scope, $routeParams, postenService) {
        $scope.$emit('changeP', $routeParams.itemNr);
    }]);
//
//AddController
//
appControllers.controller('AddController', [
    '$scope', '$routeParams', 'postenService',
    function ($scope, $routeParams, postenService) {
        postenService.appendItem($scope.$$prevSibling.item);
        $scope.items = postenService.getItems();
    }]);
//
//EditController
//
appControllers.controller('EditController', [
    '$scope', '$routeParams', 'postenService',
    function ($scope, $routeParams, postenService) {
        var item, itemNr;
        itemNr = $routeParams.itemNr;
        item = postenService.getItem(itemNr);
        $scope.item = {
            'postenDate': item.tbPostenDate.toLocaleDateString(),
            'postenText': item.tbPostenText,
            'postenProStd': item.tbPostenProStd,
            'postenStdAnz': item.tbPostenStdAnz
        };
    }]);
//
//directive$filter:goClick
//
appDirectives.directive('goClick', function ($location) {
    return function (scope, element, attrs) {
        var path;
        attrs.$observe('goClick', function (val) {
            path = val;
        });
        element.bind('click', function () {
            scope.$apply(function () {
                $location.path(path);
            });
        });
    };
});
//
//Format$filter:euro
//
appFilters.filter('euro', ['$filter', function ($filter) {
        return function (val) {
            var vl
            vl = $filter('number')(val, 2);
            return vl + "€";
        };
    }]);
//
//directive$filter:currency
//
appFilters.directive('euro', ['$filter', function ($filter) {
        return {
            require: 'ngModel',
            link: function (elem, $scope, attrs, ngModel) {
                ngModel.$formatters.push(function (val) {
                    return $filter('currency')(val)
                });
                ngModel.$parsers.push(function (val) {
                    return val.replace(/[\$,]/, '') + "€"
                });
            }
        }
    }])

//
//directive$filter:currency
//
appFilters.directive('currency', ['$filter', function ($filter) {
        return {
            require: 'ngModel',
            link: function (elem, $scope, attrs, ngModel) {
                ngModel.$formatters.push(function (val) {
                    return $filter('currency')(val);
                });
                ngModel.$parsers.push(function (val) {
                    return val.replace(/[\$,]/, '') + "€";
                });
            }
        };
    }
]);
