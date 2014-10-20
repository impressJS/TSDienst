//
//Format$filter:euro
//
app.filter('euro', ['$filter', function($filter) {
        return function(val) {
            var vl
            vl = $filter('number')(val, 2);
            return vl + "€";
        };
    }]);
//
//directive$filter:currency
//
app.directive('currency', ['$filter', function($filter) {
        return {
            require: 'ngModel',
            link: function(elem, $scope, attrs, ngModel) {
                ngModel.$formatters.push(function(val) {
                    return $filter('currency')(val)
                });
                ngModel.$parsers.push(function(val) {
                    return val.replace(/[\$,]/, '') + "€"
                });
            }
        }
    }])
