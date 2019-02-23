var long_data = [];
var dataset = d3.csv("heatmap.csv")
	.then(function(row1) {

		row1.forEach(function(d) {
			d["Bronx"] = +d.Bronx,
			d.Brooklyn = +d.Brooklyn,
			d.Manhattan = +d.Manhattan,
			d.Queens = +d.Queens,
			d["Staten"]= +d["Staten Island"],
			d["Type"] = d["Crime Type"],
			d.Year = +d.Year

	})
		row1.forEach(function(row) {
			long_data.push( {"Type": row["Type"], "Borough": "Bronx", "Count": row["Bronx"], "Year": row["Year"]});
		    long_data.push( {"Type": row["Type"], "Borough": "Brooklyn", "Count": row["Brooklyn"], "Year": row["Year"]});
		    long_data.push( {"Type": row["Type"], "Borough": "Manhattan", "Count": row["Manhattan"], "Year": row["Year"]});
		    long_data.push( {"Type": row["Type"], "Borough": "Queens", "Count": row["Queens"], "Year": row["Year"]});
		    long_data.push( {"Type": row["Type"], "Borough": "Staten Island", "Count": row["Staten"], "Year": row["Year"]});
		})
		;

var l = long_data.length;
var margin = {top: 30, right: 0, bottom: 100, left: 100},
	width = 400 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var color_gradations = 9;
var colors = d3.schemeRdPu[color_gradations];

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

x.domain(d3.extent(long_data, function(d) { return d["Type"]; })).nice();
y.domain(d3.extent(long_data, function(d) { return d["Borough"]; })).nice();


var svg = d3.select("body").append("svg")
		    .attr("width", width + 2*margin.left + 2*margin.right)
		    .attr("height", height + 2*margin.top + 2*margin.bottom)
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var types = long_data.map(function(d) {return d.Type;}).sort().filter(function(item, pos, ary) {
							        return !pos || item != ary[pos - 1];
							    });

var boroughs = long_data.map(function(d) {return d.Borough;}).sort().filter(function(item, pos, ary) {
							        return !pos || item != ary[pos - 1];
							    });

var years = long_data.map(function(d) {return d.Year;}).sort().filter(function(item, pos, ary) {
				        return !pos || item != ary[pos - 1];
				    });

var gridSize = Math.floor(width / types.length);

var yLabels = svg.selectAll(".yLabel")
		          	.data(boroughs)
		        	.enter().append("text")
		            .text(function (d) { return d; })
		            .attr("x", 0)
		            .attr("y", function (d, i) { return i * gridSize; })
		            .attr("class", "yLabel")
		            .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

var xLabels = svg.selectAll(".xLabel")
			        .data(types)
			        .enter().append("text")
				    .text(function(d) { return d; })
		            .attr("y", function(d, i) { return i * gridSize + gridSize/2; })
		            .attr("x", -(height + margin.top - 35))
		            .attr("class", "xLabel")
		            .attr("transform", "rotate(-90)")
		            ;

var yearMenu = d3.select("#yearDropdown");

yearMenu.append("select")
	   		.attr("id", "yearMenu")
	    	.selectAll("option")
	        .data(years)
	        .enter()
	        .append("option")
	        .attr("value", function(d, i) { return i; })
	        .text(function(d) { return d; });

function getDataByYear(idx = 0) {
	var temp =  long_data.filter(function(d) {
		    		if (d.Year == years[idx]){ return d; }
		    	});
			return temp;
}

function getMaxCount(year) {
	var idx = +year - years[0];
	var dataForCurrentYear = getDataByYear(idx);
	return d3.max(dataForCurrentYear, function(d) {
		return d.Count;
	});
}

var maxCountsArray = years.map(function(d, i){
	return getMaxCount(years[i]);
});

function getMaxCountInYear(year) {
	return maxCountsArray[+year - years[0]];
}

function colorScale(row) {
	var year = row.Year;
	var maxForCurrentYear = getMaxCountInYear(year);
	var scaled =  d3.scaleLinear()
				  	.domain(d3.range(0, maxForCurrentYear, 9))
				  	.range(colors);
  	return scaled(row.Count);
}

var legendElementWidth = gridSize * types.length/color_gradations;

function updateHeatMap(dataOfSelectedYear) {
	
	var temp = svg.selectAll(".tile")
      .data(dataOfSelectedYear)
      .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d, i) { return Math.floor(i/boroughs.length) * gridSize; })
      .attr("y", function(d, i) { return (i % boroughs.length) * gridSize; })
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height",  gridSize)
      .style("stroke", "white")
      .style("stroke-opacity", 0.6)
      .style("fill", function(d) { return colorScale(d); });

    var z = d3.scaleQuantile();
		z.domain([0, d3.max(dataOfSelectedYear, function(d){return d["Count"];} )]);
		z.range(colors);

    svg.selectAll(".legend").remove();

	var legend = svg.selectAll(".legend")
      				.data([0].concat(z.quantiles(color_gradations)), function(d) { return d; })
				    .enter().append("g")
				    .attr("class", "legend");

		legend.append("rect")
	            .attr("x", function(d, i) { return legendElementWidth * i; })
	            .attr("y", height + 80)
	            .attr("width", legendElementWidth)
	            .attr("height", gridSize / 3)
	            .style("fill", function(d, i) { return colors[i]; });

		legend.append("text")
	        	.attr("x",function(d, i) { return legendElementWidth * i; })
	            .attr("y", height + 90 + gridSize/3)
	            .attr("dy", ".35em")
			    .text(function(d) { return Math.round(d); });
	} 

	var defaultYearIndex = 0;
	var dataOfDefaultYear = getDataByYear(defaultYearIndex);
	updateHeatMap(dataOfDefaultYear);

yearMenu.on("change", function() {
  		// find which year was selected from the dropdown
      var selectedYearIndex = d3.select(this)
        .select("select")
        .property("value");

      var dataByYear = getDataByYear(selectedYearIndex);

      updateHeatMap(dataByYear);
      
}); 

// Title for the legend
svg.append("text")
	.attr("class", "label")
	.attr("x", 0)
	.attr("y", height + 70)
	.attr("dy", ".35em")
	.text("No. of crimes");

// Titles for axes
svg.append("text")
	.attr("x", -5)
	.attr("y", -12)
	.style("font-weight", "bold")
	.style("text-anchor", "end")
	.style("font-size", "12px")
	.text("Borough");

svg.append("text")
	.attr("x", width )
	.attr("y", (height + margin.top - 35))
	.style("font-weight", "bold")
	.style("text-anchor", "left")
	.style("font-size", "12px")
	.text("Crime Type");
});