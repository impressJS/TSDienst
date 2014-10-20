
/* ------------------------------------------------------------------------------------------ */
/* ------------------------------------ LiveTicker App -------------------------------------- */
/* ------------------------------------------------------------------------------------------ */

angular.module('tsRechApp', ['ngResource', 'ngRoute'], [function() {
}]).config(['$interpolateProvider', '$routeProvider', function($interpolateProvider, $routeProvider) {
    // prevent conflicts with twig template language
//    $interpolateProvider.startSymbol('[[');
//    $interpolateProvider.endSymbol(']]');

    // NOTE: we set templateUrl ourselves in LiveTickerAppCtrl, so we can provide individual templates for each tabId
    $routeProvider
        .when('/', { templateUrl: 'live-ticker.html'})
        .when('/:matchId/:tabId', { templateUrl: 'live-ticker.html' })
        .otherwise({redirectTo : '/'});
}]);