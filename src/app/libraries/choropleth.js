var ts = ts || {};
ts.choropleth = (function () {
    "use strict";
    var body,
        svg,
        mapGrp,
        width = 960,
        height = 1160,
        centered = true,
        tooltip,
    projection = d3.geo.albers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(6000)
        .translate([width / 2, height / 2]),
    path = d3.geo.path().projection(projection),
    click = function(d) {
        var x,
            y,
            scaleFactor,
            lineScaleFactor;
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            scaleFactor = 6;
            lineScaleFactor = 3;
            centered = d;
        } else {
            x = width / 2;
            y = height / 2;
            scaleFactor = 1;
            lineScaleFactor = 1;
            centered = null;
        }
        d3.selectAll("path")
            .classed("active animated flash", centered && function (d) {
                return d === centered;
            });
    },
    draw = function (b) {
        body = b;
        tooltip = d3.select("#tooltip");
        svg = body.append("svg")
             .attr("viewBox", "0 0 " + width + " " + height)
             .attr("width", width)
             .attr("height", height);
        mapGrp = svg.append("g").attr("id", "mapGrp");
        svg.append("filter")
            .attr("id", "dropshadow")
            .append("feGaussianBlur")
            .attr("stdDeviation", 5);
        // External boundary.
        mapGrp.append("path")
           .datum(topojson.mesh(boundaries, boundaries.objects.GBR_adm2, function (a, b) { return a === b; }))
           .attr("id", "cntry-bndry-ext")
           .attr("filter", "url(#dropshadow)")
           .attr("stroke-width", "1px")
           .attr("d", path);
        // Counties.
        mapGrp.append("g")
            .attr("class", "YlGn county")
            .attr("id", "geometries")
            .selectAll("path")
            .data(topojson.object(boundaries, boundaries.objects.GBR_adm2).geometries)
            .enter()
            .append("path")
            .attr("d", path)
            .on("click", click)
            $('.dropdown-menu').attr('click',path);
    };
    return {
        draw: draw
    };
}());
