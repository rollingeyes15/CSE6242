
// var margin = {top: 50, right: 200, bottom: 10, left: 100},
//             width = 960 - margin.left - margin.right,
//             height = 600 - margin.top - margin.bottom;

// var svg = d3.select("body").append("svg")
//             .attr("width", width + 2*margin.left + 2*margin.right)
//             .attr("height", height + 2*margin.top + 2*margin.bottom)
//             .append("g")
//             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//             ;

var svg = d3.select("svg");
// ;
var width = +svg.attr("width");
console.log("width:" + width);
   // var width = +svg.attr("width") - margin.left;
   var height = +svg.attr("height");
console.log("height:" + height  );
var unemployment = d3.map();

var path = d3.geoPath();

var x = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);
// console.log(x.domain())
var color = d3.scaleThreshold()
    .domain(d3.range(2, 10))
    .range(d3.schemeGreens[9]);

console.log(color.range());
console.log(color.domain())

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

g.selectAll("rect").append("g")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      console.log(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
  .attr("class", "legend")
    .attr("height", 15)
    // .attr("x", function(d) { return x(d[0]); })
    .attr("transform", "translate(" + (width-60) + "," + (height-300) + ")")
    .attr("x", 0)
    .attr("y", function(d, i){return  ((i * 15));})
    // .attr("x", function(d) { return x(width - 20); })
    // .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("width", 15)
    .attr("padding", 0.5)
    .attr("fill", function(d) { return color(d[0]); });


// g.selectAll("rect")
//   .data(color.range().map(function(d) {
//       d = color.invertExtent(d);
//       console.log(d);
//       if (d[0] == null) d[0] = x.domain()[0];
//       if (d[1] == null) d[1] = x.domain()[1];
//       return d;
//     }))
//   .enter().append("rect")
//     .attr("height", 15)
//     .attr("transform", "translate(" + width + "," + (height-300) + ")")
//     // .attr("x", function(d) { return x(d[0]); })
//     .attr("x", 0)
//     .attr("y", function(d, i){return  ((i * 15));})
//     // .attr("x", function(d) { return x(width - 20); })
//     // .attr("width", function(d) { return x(d[1]) - x(d[0]); })
//     .attr("width", 15)
//     .attr("padding", 0.5)
//     .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Unemployment rate");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return i ? x : x + "%"; })
    .tickValues(color.domain()))
    .select(".domain")
    .remove();

var promises = [
  d3.json("us.json"),
  d3.csv("county_poverty.csv", function(d) { unemployment.set(d.CensusId, +d.Poverty); })
]


Promise.all(promises).then(ready)
console.log(unemployment);
console.log(d3.extent(Object.values(unemployment)));

function ready([us]) {
  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { return color(d.rate = unemployment.get(d.id)); })
      .attr("d", path)
    .append("title")
      .text(function(d) { return d.rate + "%"; });

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
}