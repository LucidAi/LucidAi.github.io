/*
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */
"use strict";

app.factory("NcldApiFactory", ["$http", "$location",
    function($http, $location) {

        return {

            getTestGraph: function() {
                return $http({
                    url:    "/webapp/json/4.json",
                    method: "GET"
                });
            }

        };


}]);
