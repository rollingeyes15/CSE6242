var ranges;
var width, height;
var svg = d3.select("svg");
var color;

var unemployment = d3.map();
var path = d3.geoPath();


d3.csv("county_poverty.csv")
      .then(function(data) {
        ranges = d3.extent(data, function(row){
          return +row.Poverty;
        });

width = +svg.attr("width")
height = +svg.attr("height");

var x = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

min_poverty_rate = Math.floor(ranges[0]);
console.log(min_poverty_rate);

max_poverty_rate = Math.ceil(ranges[1]);
console.log(max_poverty_rate);

// Since we have very few counties with very high poverty rate, 
// I decided to scale the color map linearly and put the wide range of
// extreme poverties into one color bucket. Therefore, above 18% to ~30%
// will all be in one color bucket.
var domainOfColorScale = d3.range(min_poverty_rate, 18, (18-min_poverty_rate)/9);

color = d3.scaleThreshold()
    .domain(domainOfColorScale)
    .range(d3.schemeGreens[9]);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

g.selectAll("rect").append("g")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
  .attr("class", "legend")
    .attr("height", 15)
    .attr("transform", "translate(" + (width-60) + "," + (height-300) + ")")
    .attr("x", 0)
    .attr("y", function(d, i){return  ((i * 16) );})
    .attr("width", 18)
    .attr("fill", function(d) { return color(d[0]); });

g.selectAll("text").append("g")
    .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
    .enter().append("text")
    .attr("transform", "translate(" + (width-60) + "," + (height-300) + ")")
    .attr("x", 22)
    .attr("y", function(d, i){return  (10 + (i * 16) );})
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-size", "9px")
    .text(function(d, i){
          if(i < 8){
            console.log(i);
            return "\u2264" + domainOfColorScale[i+1] + "%";
          } else {
            console.log(i);
            return "\u2265"  + "18%";
      }});

g.append("text")
    .attr("x", width - 60)
    .attr("y", height - 300 -5)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .text("Poverty rate")
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("font-size", "10px");
    
});

var promises = [
  d3.json("us.json"),
  d3.csv("county_poverty.csv", function(d) { unemployment.set(d.CensusId, +d.Poverty); })
]

Promise.all(promises).then(ready);
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