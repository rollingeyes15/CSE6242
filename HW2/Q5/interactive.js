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
            	return growth_cum + d.population_2012;
            })]);

var y = d3.scaleBand()
			.range([height, 0])
			.padding(0.2)
            .domain(data.map(function (d) {
                return d.country;
            })); 

var yAxis = svg
			.append("g")
	        .attr("class", "yAxis")
	        .call(d3.axisLeft(y).ticks(0));

function mouseoverFunction(d, i) {
        d3.select(this)
        	.attr("fill", "blue");

        var growth = Object.values(d.growth);
        var cum_population = [0].concat(d.population_2012);

        for(var i = 1; i <= growth.length; i++){
        	cum_population.push(cum_population[i] + growth[i - 1]);
        }

        var growth_rates = [];
        for(var i = 1; i <= growth.length; i++){
        	growth_rates.push((growth[i-1]*100/cum_population[i]).toFixed(2));
        }

        var parseDate = d3.timeFormat("%Y");
        var years = [2013, 2014, 2015, 2016, 2017];
        years.map(year => parseDate(year));

        console.log(years);

        console.log(growth_rates);
        console.log(d3.extent(growth_rates));

        var dataset = growth_rates.map(function(d, i) {
        	console.log(years[i]);
        	return {'year': years[i], 'growth': Number(growth_rates[i])};
        });

        var yLocal = d3.scaleLinear()
            .range([height/2, 0])
            .domain(d3.extent(growth_rates));

        var xLocal = d3.scaleLinear()
            .range([0, width/2])
            .domain(d3.extent(years));

        var y_axis_local = svg
        	.append("g")
	        .attr("class", "yLocal")
	        .attr("transform", "translate(" + (width + 25) + "," + (0)+")")
	        .call(d3.axisLeft(yLocal));
  
	     var x_axis_local = svg.append("g")
	        .attr("transform", "translate(" + (width + 25 )+ "," + (height/2) + " )")
	        .call(d3.axisBottom(xLocal).ticks(years.length).tickFormat(d3.format("d")))
	        .attr("class", "yLocal");

	    var line = d3.line()
		      .x(function(d, i) { return (xLocal(d.year) + width + 25);})
		      .y(function(d, i) { return yLocal(d.growth);});

		svg.append("path")
		    .datum(dataset) 
		    .attr("class", "line") 
		    .attr("d", line);
    }

function mouseoutFunction(d, i) {
	d3.select(this).style("fill", "grey");

	d3.select("svg").selectAll("path").remove();
	d3.select("svg").selectAll(".yLocal").remove();
	d3.select("svg").selectAll(".xLocal").remove();

}


var bars = svg.selectAll(".bar");

bars
	.data(data)
	.enter()
	.append("rect")
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
	.on('mouseover', mouseoverFunction)
	.on('mouseout', mouseoutFunction );
	;

svg.append("g") 
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d){
			var growth_cum = Object.values(d.growth).reduce((a, b) => a + b);
    		var total_pop = growth_cum + d.population_2012;
    		return total_pop.toLocaleString();
	})
    .attr("x", 12)
    .attr("y", function (d) {
                return y(d.country) + y.bandwidth()/2 + 4;
            })
    .attr("class", "labeltext");    