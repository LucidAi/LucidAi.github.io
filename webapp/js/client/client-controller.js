/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("NlcdClientController", ["$scope", "$location", "$sce", "NcldApiFactory",
    function ($scope, $location, $sce, NcldApiFactory) {

        /**
          *
          **/

        var graphId = $location.search().g;

        $scope.central              = null;
        $scope.related              = [];
        $scope.meta                 = null;
        $scope.selection            = [];
        $scope.textSelection        = null;
        $scope.dateDistr            = null;
        $scope.selectedDateEntry    = null;

        $scope.display = {

            // Tab 'ALL'
            relatedTabAllReversed:        false,
            relatedTabAllPredicate:       "inSelection",

            // Tab 'SOURCES'
            relatedTabSourcesReversed:    false,
            relatedTabSourcesPredicate:   "referenceCount",

            // Tab 'AUTHORS'
            relatedTabAuthorsReversed:    false,
            relatedTabAuthorsPredicate:   "referenceCount",

            // Tab 'DATES'
            relatedTabDatesReversed:      false,
            relatedTabDatesPredicate:     "documentsCount"

        };


        // Init bootstrap javascript
        $("#relatedTabs a").click(function (e) {
            e.preventDefault();
            $(this).tab("show");
        });
        $("#relatedTabs a:first").tab("show");
        
        
        // Init tooltipe
        $(".tip-tooltip").tooltip({
            "animation": true,
            "placement": "top",
        });
        
        $("body").popover({
              "container": "body",
              "trigger": "hover",
              "delay": 1,
              "html": true,
              "placement": "right",
              "selector": ".tip-popover"
        });

        NcldApiFactory.getTestGraph(graphId).success(function(data){
            
            $scope.sg = new StoryGraph(data);
            $scope.central = $scope.sg.getCentralNode();
            $scope.related = $scope.sg.getNodes();
            $scope.meta = data.meta;

            var distrPlaceId = "storyDistribution";
            var nwPlaceId = "storyNetwork";

            var distrWidth = document.getElementById(distrPlaceId).offsetWidth;
            var nwWidth = document.getElementById(nwPlaceId).offsetWidth;

            var height = 300;

            $scope.sg.drawDistribution(distrPlaceId, distrWidth, height);
            $scope.sg.drawNetwork(nwPlaceId, nwWidth, height);
            $scope.dateDistr = $scope.sg.distr.dateDistr;

        });


        //
        $scope.RelatedAllTabOrderBy = function(predicate) {
            if ($scope.display.relatedTabAllPredicate == predicate) {
                $scope.display.relatedTabAllReversed = !$scope.display.relatedTabAllReversed;
            }
            $scope.display.relatedTabAllPredicate = predicate;
        }


        //
        $scope.RelatedDatesTabOrderBy = function(predicate) {
            if ($scope.display.relatedTabDatesPredicate == predicate) {
                $scope.display.relatedTabDatesReversed = !$scope.display.relatedTabDatesReversed;
            }
            $scope.display.relatedTabDatesPredicate = predicate;
        }


        //
        $scope.SetSelection = function(referencesList) {
            $scope.DeselectDate($scope.selectedDateEntry);
            for (var i in $scope.selection) {
                $scope.selection[i].inSelection = null;
            };
            $scope.selection = [];
            for (var i in referencesList) {
                var refId = referencesList[i];
                var item = $scope.sg.getNode(refId);
                item.inSelection = true;
                $scope.selection.push(item);
            };
            $scope.sg.gfx.SetDistributionSelection(referencesList);
            $scope.sg.gfx.SetNetworkSelection(referencesList);
        };


        //
        $scope.TextSelection = function(chunk, referencesList) {
            if ($scope.textSelection) {
                $scope.textSelection.isSelected = false;
                if ($scope.textSelection.tagId == chunk.tagId) {
                    $scope.textSelection = null;
                    $scope.SetSelection([]);
                    return;
                }
            }
            $scope.textSelection = chunk;
            $scope.textSelection.isSelected = true;
            $scope.SetSelection(referencesList);
        };


        //
        $scope.SelectDate = function(dateEntry) {
            if ($scope.selectedDateEntry)
                $scope.DeselectDate($scope.selectedDateEntry);
            $scope.selectedDateEntry = dateEntry;
            $scope.SetSelection([]);
            $scope.SetSelection(dateEntry.selection);
            dateEntry.selected = true;
            
        };


        //
        $scope.DeselectDate = function(dateEntry) {
            if ($scope.selectedDateEntry) {
                $scope.selectedDateEntry = null;
            }
            dateEntry.selected = false;
            $scope.SetSelection([]);
        };

        //
        $scope.toolPopoverContent = function(node) {
            
            var authors = node.authors.join(", ").toTitleCase();
            var source = "";
            var len = 10000;
            for (var i in node.sources) {
                if (node.sources[i].length < len) {
                    source = node.sources[i];
                    len = node.sources[i].length;
                }
            }
            
            return "<ul><li>authror: "
                   + authors
                   + "</li><li>source: "
                   + source
                   + "</li></ul><p><small>"
                   + String.prototype.CutStr(node.body, true, 256, "...")
                   + "</small><p>";
        }

}]);