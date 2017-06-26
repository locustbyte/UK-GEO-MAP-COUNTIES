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
  /** @ngInject */
  function MainController($timeout, webDevTec, toastr, $scope) {
    var vm = $scope;

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
    vm.countyStat = userData;
    vm.storeName = false;

    vm.outletList = storeData.stores
    vm.loadStats = function(county){
      $("#chart svg").remove();
      var barChartData = []

      barChartData = vm.findProp(vm.countyStat, county);
      console.log(barChartData);

      var w = 300;
      var h = 50;

      var dataset = [
      	{ key: "Nurse", value: jQuery.grep(barChartData[0], function (person) { return person.profession == "nurse" }).length },
      	{ key: "Pharmacist", value: jQuery.grep(barChartData[0], function (person) { return person.profession == "pharmacist" }).length } ];

      var xScale = d3.scale.ordinal()
      				.domain(d3.range(dataset.length))
      				.rangeRoundBands([0, w], 0.05);

      var yScale = d3.scale.linear()
      				.domain([0, d3.max(dataset, function(d) {return d.value;})])
      				.range([0, h]);

      var key = function(d) {
      	return d.key;
      };

      //Create SVG element
      var svg = d3.select("#chart")
      			.append("svg")
      			.attr("width", w)
      			.attr("height", h);

      //Create bars
      svg.selectAll("rect")
         .data(dataset, key)
         .enter()
         .append("rect")
         .attr("x", function(d, i) {
      		return xScale(i);
         })
         .attr("y", function(d) {
      		return h - yScale(d.value);
         })
         .attr("width", xScale.rangeBand())
         .attr("height", function(d) {
      		return yScale(d.value);
         })
         .attr("fill", function(d) {
      		return "rgb(0, 0, " + (d.value * 10) + ")";
         })

      	//Tooltip
      	.on("mouseover", function(d) {
      		//Get this bar's x/y values, then augment for the tooltip
      		var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
      		var yPosition = parseFloat(d3.select(this).attr("y")) + 14;

      		//Update Tooltip Position & value
      		d3.select("#tooltip")
      			.style("left", xPosition + "px")
      			.style("top", yPosition + "px")
      			.select("#value")
      			.text(d.value);
      		d3.select("#tooltip").classed("hidden", false)
      	})
      	.on("mouseout", function() {
      		//Remove the tooltip
      		d3.select("#tooltip").classed("hidden", true);
      	})	;

      //Create labels
      svg.selectAll("text")
         .data(dataset, key)
         .enter()
         .append("text")
         .text(function(d) {
      		return d.value;
         })
         .attr("text-anchor", "middle")
         .attr("x", function(d, i) {
      		return xScale(i) + xScale.rangeBand() / 2;
         })
         .attr("y", function(d) {
      		return h - yScale(d.value) + 14;
         })
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white");

      var sortOrder = false;
      var sortBars = function () {
          sortOrder = !sortOrder;

          sortItems = function (a, b) {
              if (sortOrder) {
                  return a.value - b.value;
              }
              return b.value - a.value;
          };

          svg.selectAll("rect")
              .sort(sortItems)
              .transition()
              .delay(function (d, i) {
              return i * 50;
          })
              .duration(1000)
              .attr("x", function (d, i) {
              return xScale(i);
          });

          svg.selectAll('text')
              .sort(sortItems)
              .transition()
              .delay(function (d, i) {
              return i * 50;
          })
              .duration(1000)
              .text(function (d) {
              return d.value;
          })
              .attr("text-anchor", "middle")
              .attr("x", function (d, i) {
              return xScale(i) + xScale.rangeBand() / 2;
          })
              .attr("y", function (d) {
              return h - yScale(d.value) + 14;
          });
      };
      // Add the onclick callback to the button
      d3.select("#sort").on("click", sortBars);
      d3.select("#reset").on("click", reset);
      function randomSort() {


      	svg.selectAll("rect")
              .sort(sortItems)
              .transition()
              .delay(function (d, i) {
              return i * 50;
          })
              .duration(1000)
              .attr("x", function (d, i) {
              return xScale(i);
          });

          svg.selectAll('text')
              .sort(sortItems)
              .transition()
              .delay(function (d, i) {
              return i * 50;
          })
              .duration(1000)
              .text(function (d) {
              return d.value;
          })
              .attr("text-anchor", "middle")
              .attr("x", function (d, i) {
              return xScale(i) + xScale.rangeBand() / 2;
          })
              .attr("y", function (d) {
              return h - yScale(d.value) + 14;
          });
      }
      function reset() {
      	svg.selectAll("rect")
      		.sort(function(a, b){
      			return a.key - b.key;
      		})
      		.transition()
              .delay(function (d, i) {
              return i * 50;
      		})
              .duration(1000)
              .attr("x", function (d, i) {
              return xScale(i);
      		});

      	svg.selectAll('text')
              .sort(function(a, b){
      			return a.key - b.key;
      		})
              .transition()
              .delay(function (d, i) {
              return i * 50;
          })
              .duration(1000)
              .text(function (d) {
              return d.value;
          })
              .attr("text-anchor", "middle")
              .attr("x", function (d, i) {
              return xScale(i) + xScale.rangeBand() / 2;
          })
              .attr("y", function (d) {
              return h - yScale(d.value) + 14;
          });
      };

    }
    vm.hitMap = function(d, i) {
      vm.regionName = "Region: " + i;
      vm.loadStats(i);
      //Send click event on d3map for the county - to highlight
      $("[d='"+d+"']").d3Click();
    }
    //Respond to store filter - should load bar chart for 'store' showing Nurses and Phamacists data
    vm.changeStore = function(storeName){
      vm.loadStats(storeName)
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
      var mapRegionss = [];
      var dropItems = d3.selectAll('path')[0];
      //clear first as it's not an actual county
      dropItems.shift();
      var i = 0;
      for (i = 0; i < dropItems.length; ++i) {
          var front = dropItems[i].outerHTML.split('<path d="')[1]
          var complete = front.split('"></path>')[0]

          mapRegions.push({"url": complete, "label": boundaries.objects.GBR_adm2.geometries[i].properties.NAME_2});

          i++;
      }
      //set ng scope var for ng-repeat
      vm.mapRegionss = mapRegions;
    });
  }
})();
