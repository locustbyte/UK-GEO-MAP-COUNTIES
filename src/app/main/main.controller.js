(function() {
  'use strict';
  angular
    .module('angularVersion')
    .controller('MainController', MainController)
    .filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    })

  function MainController($timeout, webDevTec, toastr, $scope) {
    var vm = $scope;

    //A function which will search an array object
    vm.findProp = function(obj, key, out) {
        var i,
            proto = Object.prototype,
            ts = proto.toString,
            hasOwn = proto.hasOwnProperty.bind(obj);

        if ('[object Array]' !== ts.call(out)) out = [];

        for (i in obj) {
            if (hasOwn(i)) {
                if (i === key) {
                    out.push(obj[i]);
                } else if ('[object Array]' === ts.call(obj[i]) || '[object Object]' === ts.call(obj[i])) {
                    vm.findProp(obj[i], key, out);
                }
            }
        }

        return out;
    }

    //scope variable which contains county data nurse and pharmacist data
    vm.countyStat = userData;



    //scope variable which contains county data nurse and pharmacist data
    //chosen store name variable
    vm.storeName = false;
    vm.outletList = storeData.stores
    vm.loadStats = function(county){
      $("#chart svg").remove();
      var barChartData = [];
      barChartData = vm.findProp(vm.countyStat, county);

      if ( barChartData.length > 0) {

        var dataArray = [{"name": "Nurse", "value": jQuery.grep(barChartData[0], function (person) { return person.profession == "nurse" }).length},{"name": "Pharmacist", "value": jQuery.grep(barChartData[0], function (person) { return person.profession == "pharmacist" }).length}];
        var dataArray = [jQuery.grep(barChartData[0], function (person) { return person.profession == "nurse" }).length, jQuery.grep(barChartData[0], function (person) { return person.profession == "pharmacist" }).length];
        // Create variable for the SVG
        var svg = d3.select("#chart").append("svg")
                  .attr("height","100%")
                  .attr("width","100%");

        // Select, append to SVG, and add attributes to rectangles for bar chart
        svg.selectAll("rect")
            .data(dataArray)
            .enter().append("rect")
                  .attr("class", "bar")
                  .attr("height", function(d, i) {return (d * 10)})
                  .attr("width","40")
                  .attr("x", function(d, i) {return (i * 60) + 25})
                  .attr("y", function(d, i) {return 400 - (d * 10)});

        // Select, append to SVG, and add attributes to text
        svg.selectAll("text")
            .data(dataArray)
            .enter().append("text")
            .text(function(d) {return d})
                   .attr("class", "text")
                   .attr("x", function(d, i) {return (i * 60) + 36})
                   .attr("y", function(d, i) {return 400 - (d * 10)});
      }

    }

    //d is the d=attribute d3 map url d3 uses to alter the map (selection).  we will simulate that with the Jquery .d3click event below.
    vm.hitMap = function(d, i) {
      vm.regionName = "Region: " + i;
      //calls the load stats which will draw data if exists for this county
      vm.loadStats(i);
      //Simulate the click after we do other things, the actions are defined in the click event in the chloropeth.js file.
      $("[d='"+d+"']").d3Click();
    }
    //Respond to store filter - should load bar chart for 'store' showing Nurses and Phamacists data
    vm.changeStore = function(storeName){
      vm.loadStats(storeName);
    }
    angular.element(document).ready(function() {

      var body = d3.select("body");
      ts.choropleth.draw(body);
        jQuery.fn.d3Click = function() {
          this.each(function(i, e) {
            var evt = new MouseEvent("click");
            e.dispatchEvent(evt);
          });
        };
      var mapRegions = [];

      //gets a list of the d3 items, we're looking for the outerHTML d= attribute value.
      var dropItems = d3.selectAll('path')[0];
      //clear first as it's not an actual county
      dropItems.shift();

      //This next bit is responsible for stripping the d3 d attribute url left / right and pushing to an array we can use in the population of the dropdown.
      var i = 0;
      for (i = 0; i < dropItems.length; ++i) {
          var front = dropItems[i].outerHTML.split('<path d="')[1]
          var complete = front.split('"></path>')[0];

          mapRegions.push({"url": complete, "label": boundaries.objects.GBR_adm2.geometries[i].properties.NAME_2});

          i++;
      }
      //set ng scope var for ng-repeat of the map region data.
      vm.mapRegionss = mapRegions;
    });
  }
})();
