var data = [{country: 'Bangladesh', population_2012: 105905297, growth: {year_2013:42488 , year_2014:934 , year_2015:52633 , year_2016:112822 , year_2017:160792}},
			        {country: 'Ethopia', population_2012: 75656319, growth: {year_2013:1606010 , year_2014:1606705 , year_2015:1600666 , year_2016:1590077 , year_2017:1580805}},
			        {country: 'Kenya', population_2012: 33007327, growth: {year_2013:705153 , year_2014:703994 , year_2015:699906 , year_2016:694295 , year_2017:687910}},
			        {country: 'Afghanistan', population_2012: 23280573, growth: {year_2013:717151 , year_2014:706082 , year_2015:665025 , year_2016:616262 , year_2017:573643}},
			        {country: 'Morocco', population_2012: 13619520, growth: {year_2013:11862 , year_2014:7997 , year_2015:391 , year_2016:-8820 , year_2017:-17029}}];


var margin = {top: 50, right: 200, bottom: 10, left: 100},
	width = 900 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + 2*margin.right)
	    .attr("height", height + 2*margin.top + 2*margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
            	var growth_cum = Object.values(d.growth).reduce((a, b) => a + b);
            	// console.log(growth_cum + d.population_2012);
            	return growth_cum + d.population_2012;
            })]);

var y = d3.scaleBand()
			// .range([height, 0], .1)
			.range([height, 0])
			.padding(0.2)
            .domain(data.map(function (d) {
                return d.country;
            })); 

var yAxis = svg
// .selectAll("main")
			.append("g")
	        .attr("class", "yAxis")
	        // .tickSizeInner(0)
	        // .ticks(0)
	        .call(d3.axisLeft(y).ticks(0));

// var xAxis = svg.append("g")
// 		        .attr("class", "x axis")
// 		        .attr("transform", "translate(0," + height + ")")
// 		        .call(d3.axisBottom(x));
	        // .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d / 1000); }).tickSizeInner([-height]))

function mouseoverFunction(d, i) {
        d3.select(this)
        	.attr("fill", "blue");

        var growth = Object.values(d.growth);
        // console.log(growth);
        // console.log(d.population_2012);
        var cum_population = [0].concat(d.population_2012);
        // console.log(cum_population);
        for(var i = 1; i <= growth.length; i++){
        	cum_population.push(cum_population[i] + growth[i - 1]);
        }
        // console.log(cum_population);

        var growth_rates = [];
        for(var i = 1; i <= growth.length; i++){
        	growth_rates.push((growth[i-1]*100/cum_population[i]).toFixed(2));
        }

        var parseDate = d3.timeFormat("%Y");
        console.log(parseDate);


        var years = [2013, 2014, 2015, 2016, 2017];
        years.map(year => parseDate(year));
        console.log(years);

        console.log(growth_rates);
        console.log(d3.extent(growth_rates));

        var dataset = growth_rates.map(function(d, i) {
        	console.log(years[i]);
        	return {'year': years[i], 'growth': Number(growth_rates[i])};
        });
        console.log(dataset);

        var y_local = d3.scaleLinear()
            .range([height/2, 0])
            .domain(d3.extent(growth_rates));

        var x_local = d3.scaleLinear()
            .range([0, width/2])
            .domain(d3.extent(years));

        var y_axis_local = svg
        	.append("g")
        // 	;

        // y_axis_local
			// .append(".path")
	        .attr("class", "y_axis_local")
	        .attr("transform", "translate(" + (width + 25) + "," + (0)+")")
	        .call(d3.axisLeft(y_local))
	        ;

	     var x_axis_local = svg.append("g")
	     // .append("linechart")
	        
	        .attr("transform", "translate(" + (width + 25 )+ "," + (height/2) + " )")
	        .call(d3.axisBottom(x_local).ticks(years.length))
	        // .attr("class", "line")
	        ;
//         	svg.append("text")

		    var line = d3.line()
			      .x(function(d, i) { return (x_local(d.year) + width + 25);})
			      .y(function(d, i) { return y_local(d.growth);});

			svg.append("path")
			    .datum(dataset) // 10. Binds data to the line 
			    .attr("class", "line") // Assign a class for styling 
			    .attr("d", line);
  //           .attr("y", y(d.country) + y.bandwidth()/2 + 4)

//      		.attr("x", 20)
//      		// .style("color", "red")
//      		.attr("class", "labeltext")

//      		.text("testsss")
		// ;

    }

function mouseoutFunction(d, i) {
d3.select(this).style("fill", "grey");

// d3.select("g").selectAll().remove();
d3.select("svg").selectAll("line").remove();
d3.select("svg").selectAll("x_axis_local").remove();
}


var bars = svg.selectAll(".bar");
bars
.data(data)
.enter()
.append("rect")
// .attr("class", "bar")
.attr("y", function (d) {
    return y(d.country);
})
.attr("height", y.bandwidth())
.attr("x", 0)
.attr("fill", "grey")
.attr("width", function (d) {
	var growth_cum = Object.values(d.growth).reduce((a, b) => a + b);
    var total_pop = growth_cum + d.population_2012;
    // console.log("total_pop = " + total_pop);
    return x(total_pop);
})
//    .on("mouseover", function(){
	// 	d3.select(this).attr("fill", "orange");
//     // tooltip
//     //   .style("left", d3.event.pageX - 50 + "px")
//     //   .style("top", d3.event.pageY - 70 + "px")
//     //   .style("display", "inline-block")
//     //   .html((d.area) + "<br>" + "£" + (d.value));
// }
// )
.on('mouseover', mouseoverFunction)
.on('mouseout', mouseoutFunction )
;


// var tooltip = d3.select("body").append("div").attr("class", "toolTip");

bars.append("text")
	.attr("y", function (d) {
                return y(d.country) + y.bandwidth()/2 + 4;
            })
	.attr("x", 20)
	// .style("color", "red")
	.attr("class", "labeltext")

	.text(function(d){
		var growth_cum = Object.values(d.growth).reduce((a, b) => a + b);
    var total_pop = growth_cum + d.population_2012;
    return total_pop.toLocaleString();
});
       

		// var long_data = [];
//          var dataset = d3.csv("heatmap.csv")
//          	.then(function(row1) {

//          		row1.forEach(function(d) {
//          			d["Bronx"] = +d.Bronx,
//          			d.Brooklyn = +d.Brooklyn,
//          			d.Manhattan = +d.Manhattan,
//          			d.Queens = +d.Queens,
//          			d["Staten"]= +d["Staten Island"],
//          			d["Type"] = d["Crime Type"],
//          			d.Year = +d.Year

//          	})
//          		row1.forEach(function(row) {
//          			long_data.push( {"Type": row["Type"], "Borough": "Bronx", "Count": row["Bronx"], "Year": row["Year"]});
		// 		    long_data.push( {"Type": row["Type"], "Borough": "Brooklyn", "Count": row["Brooklyn"], "Year": row["Year"]});
		// 		    long_data.push( {"Type": row["Type"], "Borough": "Manhattan", "Count": row["Manhattan"], "Year": row["Year"]});
		// 		    long_data.push( {"Type": row["Type"], "Borough": "Queens", "Count": row["Queens"], "Year": row["Year"]});
		// 		    long_data.push( {"Type": row["Type"], "Borough": "Staten Island", "Count": row["Staten"], "Year": row["Year"]});
//          		})
//          		;

//          var l = long_data.length;

		
//  		var color_gradations = 9;

//  		var colors = d3.schemeRdPu[color_gradations];

//  		var x = d3.scaleLinear().range([0, width]);
		// var y = d3.scaleLinear().range([height, 0]);
		// // var z = d3.scaleLinear().range(colors);
		

		// x.domain(d3.extent(long_data, function(d) { return d["Type"]; })).nice();
		// y.domain(d3.extent(long_data, function(d) { return d["Borough"]; })).nice();
		

  //       var svg = d3.select("body").append("svg")
		// 		    .attr("width", width + 2*margin.left + 2*margin.right)
		// 		    .attr("height", height + 2*margin.top + 2*margin.bottom)
		// 		    .append("g")
		// 		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		// var types = long_data.map(function(d) {return d.Type;}).sort().filter(function(item, pos, ary) {
		// 							        return !pos || item != ary[pos - 1];
		// 							    });

		// var boroughs = long_data.map(function(d) {return d.Borough;}).sort().filter(function(item, pos, ary) {
		// 							        return !pos || item != ary[pos - 1];
		// 							    });

		// var years = long_data.map(function(d) {return d.Year;}).sort().filter(function(item, pos, ary) {
		// 				        return !pos || item != ary[pos - 1];
		// 				    });

		// var gridSize = Math.floor(width / types.length);

		// var yLabels = svg.selectAll(".yLabel")
		// 		          	.data(boroughs)
		// 		        	.enter().append("text")
		// 		            .text(function (d) { return d; })
		// 		            .attr("x", 0)
		// 		            .attr("y", function (d, i) { return i * gridSize; })
		// 		            .attr("class", "yLabel")
		// 		            .style("text-anchor", "end")
		// 		            .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

		// var xLabels = svg.selectAll(".xLabel")
		// 			        .data(types)
		// 			        .enter().append("text")
		// 				    .text(function(d) { return d; })
		// 		            .attr("y", function(d, i) { return i * gridSize + gridSize/2; })
		// 		            .attr("x", -(height + 6))
		// 		            .attr("class", "xLabel")
		// 		            .style("text-anchor", "end")
		// 		            .attr("transform", "rotate(-90)")
		// 		            ;

	 //    var locationMenu = d3.select("#locationDropdown");
	    
	 //    locationMenu.append("select")
		// 	   		.attr("id", "locationMenu")
		// 	    	.selectAll("option")
		// 	        .data(years)
		// 	        .enter()
		// 	        .append("option")
		// 	        .attr("value", function(d, i) { return i; })
		// 	        .text(function(d) { return d; });

	 //    function getDataByYear(idx = 0) {
	 //    	var temp =  long_data
	 //    			.filter(function(d) {
		// 		    		if (d.Year == years[idx]){ return d; }
		// 		    	});
	 //    			return temp;
	 //    }

		// function getMaxCount(year) {
		// 	var idx = +year - years[0];
		// 	var dataForCurrentYear = getDataByYear(idx);
		// 	return d3.max(dataForCurrentYear, function(d) {
		// 		return d.Count;
		// 	});
		// }

		// var maxCountsArray = years.map(function(d, i){
		// 	return getMaxCount(years[i]);
		// });

		// function getMaxCountInYear(year) {
		// 	return maxCountsArray[+year - years[0]];
		// }

		// function colorScale(row) {
		// 	var year = row.Year;
		// 	var maxForCurrentYear = getMaxCountInYear(year);
		// 	var scaled =  d3.scaleLinear()
		// 				  	.domain(d3.range(0, maxForCurrentYear, 9))
		// 				  	.range(colors);
		//   	return scaled(row.Count);
		// }

		// var legendElementWidth = gridSize * types.length/color_gradations;


  //     	function updateHeatMap(dataOfSelectedYear) {
  //     		svg.selectAll(".tile")
		//       .data(dataOfSelectedYear)
		//     	.enter().append("rect")
		//       .attr("class", "tile")
		//       .attr("x", function(d, i) { return Math.floor(i/boroughs.length) * gridSize; })
		//       .attr("y", function(d, i) { return (i % boroughs.length) * gridSize; })
		//       .attr("class", "hour bordered")
		//       .attr("width", gridSize)
		//       .attr("height",  gridSize)
		//       .style("stroke", "white")
		//       .style("stroke-opacity", 0.6)
		//       .style("fill", function(d) { return colorScale(d); });

		//     var z = d3.scaleQuantile();
	// 			z.domain([0, d3.max(dataOfSelectedYear, function(d){return d["Count"];} )]);
	// 			z.range(colors);
	// 			// z.domain([0, d3.max(long_data, function(d){return d["Count"];} )]);
	// 			console.log(z);

	// 			var legend = svg.selectAll(".legend")
		//       				// .data(z.ticks(9).slice(1).reverse())
		//       				.data([0].concat(z.quantiles(color_gradations)), function(d) { return d; })
		// 				    .enter().append("g")
		// 				    .attr("class", "legend");

		// 	legend.append("rect")
		//             .attr("x", function(d, i) { return legendElementWidth * i; })
		//             .attr("y", height + 80)
		//             .attr("width", legendElementWidth)
		//             .attr("height", gridSize / 3)
		//             .style("fill", function(d, i) { return colors[i]; });


//         		legend.append("text")
		//             // .attr("x",function(d, i) { return legendElementWidth * (color_gradations - i - 1); })
		//             .attr("x",function(d, i) { return legendElementWidth * i; })
		//             .attr("y", height + 90 + gridSize/3)
		//             .attr("dy", ".35em")
		// 		    .text(function(d) { return Math.round(d); });
    
		//     legend.exit().remove();



  //     	} 

  //     	var defaultYearIndex = 0;
  //     	var dataOfDefaultYear = getDataByYear(defaultYearIndex);
  //     	updateHeatMap(dataOfDefaultYear);

	 //    locationMenu.on("change", function() {
	 //      		// find which year was selected from the dropdown
		//       var selectedYearIndex = d3.select(this)
		//         .select("select")
		//         .property("value");

		//       var dataByYear = getDataByYear(selectedYearIndex);

		//       updateHeatMap(dataByYear);
		      
	 //    }); 

	 //    // console.log(z);

  // svg.append("text")
  //     .attr("class", "label")
  //     .attr("x", 0)
  //     .attr("y", height + 70)
  //     .attr("dy", ".35em")
  //     .text("No. of crimes");

	    // var legend = svg.selectAll(".legend")
//        		.data([0].concat(colorScale.quantiles()), function(d) { return d; });

//    legend.enter().append("g")
//        .attr("class", "legend");

//    legend.append("rect")
//      .attr("x", function(d, i) { return legendElementWidth * i; })
//      .attr("y", height)
//      .attr("width", legendElementWidth)
//      .attr("height", gridSize / 2)
//      .style("fill", function(d, i) { return colors[i]; });

//    legend.append("text")
//      .attr("class", "mono")
//      .text(function(d) { return "≥ " + Math.round(d); })
//      .attr("x", function(d, i) { return legendElementWidth * i; })
//      .attr("y", height + gridSize);

//    legend.exit().remove();


// var legendData = [["bad rating", "red", "circle"], ["good rating", "blue", "cross"]];

// svg.selectAll('.symbol')
//     .data(legendData)
//     .enter()
//     .append('path')
//     .attr('transform', function(d, i) {
//       return 'translate(' + (width) + ',' + ((i * 20) + 10) + ')';
//     })
//     .attr('d', d3.symbol().type(function(d, i) {
//         if (d[2] === "circle") {
//           return d3.symbolCircle;
//         } else if (d[2] === "cross") {
//           return d3.symbolCross;
//         } 
//       })
//       .size(25))
//     .style("stroke", function(d) {
//       return d[1];
//     });

//   svg.selectAll('.label')
//     .data(legendData)
//     .enter()
//     .append('text')
//     .attr("x", width + 7.5)
//     .attr("y", function(d, i){ return ((i * 20) + 12.5);})
//     .text(function(d) {
//       return d[0];
//     });

//    // Add Title 
// svg.append("text")
// 	.attr("x", (width/2 - margin.right ))
// 	.attr("y", 0)
// 	// .attr("class", "label")
// 	.attr("text-anchor", "middle")
// 	.attr("font-family", "sans-serif")
// 	.attr("font-size", "12px")
// 	.attr("font-weight", "bold")
// 	.text("Wins+Nominations vs. Rating");

// // Add x-axis label
// svg.append("text")
//      // .attr("class", "label")
//      .attr("x", width + margin.left - 5)
//      .attr("y", height )
//      .attr("font-size", "11px")
//      .attr("font-family", "sans-serif")
//      .style("text-anchor", "end")
//      .text("Rating");

//     // Add y-axis label
// svg.append("text")
//      // .attr("class", "label")
//      .attr("x",  margin.left - 30)
//      .attr("y", margin.top - 12)
//      .attr("font-size", "11px")
//      .attr("font-family", "sans-serif")
//      .attr("transform", "rotate(-90)")
//      .style("text-anchor", "end")
//      .text("Wins+Noms");
// });