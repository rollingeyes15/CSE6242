d3.csv("movies.csv")
    	.then(function(data) {

    		data.forEach(function(d) {
    			d.WinsNoms = +d.WinsNoms,
    			d.Rating = +d.Rating,
    			d.Budget = +d.Budget,
    			d.IsGoodRating = +d.IsGoodRating
    		});

			var margin = {top: 80, right: 150, bottom: 120, left: 70},
   			width = 900 - margin.left - margin.right,
    		height = 500 - margin.top - margin.bottom;

    	var x = d3.scaleLinear().range([0, width]);
			var y = d3.scaleLinear().range([height, 0]);

      var svg1 = d3.select("#svg1").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     	var data1 = data.map(function(d) {
     			return [d.Rating, d.WinsNoms, d.IsGoodRating]
     		}
     	);

     	x.domain(d3.extent(data1, function(d) { return d[0]; })).nice();
    	y.domain(d3.extent(data1, function(d) { return d[1]; })).nice();


	// Add the x-axis.
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        ;
 
    // Add the y-axis.
    svg1.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        ;

	var symbolGenerator = d3.symbol()
	  						.size(15);

	function getSymbol(d) {
		return d[2] ? d3.symbolCross : d3.symbolCircle;
	}

// Add the points!
	svg1
	.selectAll('path')
	.data(data1)
	.enter()
	.append('path')
	.attr("stroke", function(d){return d[2] ? "blue":"red"})
	.attr('transform', function(d) {
		return "translate(" + x(d[0]) + "," + y(d[1]) + ")"; 
	})
	.attr('d', function(d) {
			symbolGenerator.type(getSymbol(d));
			return symbolGenerator();
	});

	var legendData = [["bad rating", "red", "circle"], ["good rating", "blue", "cross"]];

	svg1.selectAll('.symbol')
     .data(legendData)
     .enter()
     .append('path')
     .attr('transform', function(d, i) {
       return 'translate(' + (width) + ',' + ((i * 20) + 10) + ')';
     })
     .attr('d', d3.symbol().type(function(d, i) {
         if (d[2] === "circle") {
           return d3.symbolCircle;
         } else if (d[2] === "cross") {
           return d3.symbolCross;
         } 
       })
       .size(25))
     .style("stroke", function(d) {
       return d[1];
     });

   svg1.selectAll('.label')
     .data(legendData)
     .enter()
     .append('text')
     .attr("x", width + 7.5)
     .attr("y", function(d, i){ return ((i * 20) + 12.5);})
     .text(function(d) {
       return d[0];
     });

    // Add Title 
	svg1.append("text")
		.attr("x", (width/2 - margin.right ))
		.attr("y", -10)
		// .attr("class", "label")
		.attr("text-anchor", "middle")
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("font-weight", "bold")
		.text("Wins+Nominations vs. Rating");

	// Add x-axis label
	svg1.append("text")
      // .attr("class", "label")
      .attr("x", width + margin.left - 25)
      .attr("y", height )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "end")
      .text("Rating");

     // Add y-axis label
	svg1.append("text")
      // .attr("class", "label")
      .attr("x",  margin.left - 30)
      .attr("y", margin.left - 50  )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text("Wins+Noms");
});

// 1a - 2nd part

d3.csv("movies.csv")
      .then(function(data) {

        data.forEach(function(d) {
          d.WinsNoms = +d.WinsNoms,
          d.Rating = +d.Rating,
          d.Budget = +d.Budget,
          d.IsGoodRating = +d.IsGoodRating
        });

      var margin = {top: 80, right: 150, bottom: 120, left: 70},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      var svg2 = d3.select("#svg2").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("class", "pagebreak")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var data1 = data.map(function(d) {
          return [d.Rating, d.Budget, d.IsGoodRating]
        }
      );

      x.domain(d3.extent(data1, function(d) { return d[0]; })).nice();
      y.domain(d3.extent(data1, function(d) { return d[1]; })).nice();


  // Add the x-axis.
    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        ;
 
    // Add the y-axis.
    svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        ;

  var symbolGenerator = d3.symbol()
                .size(15);

  function getSymbol(d) {
    return d[2] ? d3.symbolCross : d3.symbolCircle;
  }

  // Add the points!
  svg2
  .selectAll('path')
  .data(data1)
  .enter()
  .append('path')
  .attr("stroke", function(d){return d[2] ? "blue":"red"})
  .attr('transform', function(d) {
    return "translate(" + x(d[0]) + "," + y(d[1]) + ")"; 
  })
  .attr('d', function(d) {
      symbolGenerator.type(getSymbol(d));
      return symbolGenerator();
  });

  var legendData = [["bad rating", "red", "circle"], ["good rating", "blue", "cross"]];

  svg2.selectAll('.symbol')
     .data(legendData)
     .enter()
     .append('path')
     .attr('transform', function(d, i) {
       return 'translate(' + (width) + ',' + ((i * 20) + 10) + ')';
     })
     .attr('d', d3.symbol().type(function(d, i) {
         if (d[2] === "circle") {
           return d3.symbolCircle;
         } else if (d[2] === "cross") {
           return d3.symbolCross;
         } 
       })
       .size(25))
     .style("stroke", function(d) {
       return d[1];
     });

   svg2.selectAll('.label')
     .data(legendData)
     .enter()
     .append('text')
     .attr("x", width + 7.5)
     .attr("y", function(d, i){ return ((i * 20) + 12.5);})
     .text(function(d) {
       return d[0];
     });

    // Add Title 
  svg2.append("text")
    .attr("x", (width/2 - margin.right -25))
    .attr("y", 0)
    // .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Budget vs. Rating");

  // Add x-axis label
  svg2.append("text")
      // .attr("class", "label")
      .attr("x", width + margin.left - 25)
      .attr("y", height )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "end")
      .text("Rating");

     // Add y-axis label
  svg2.append("text")
      // .attr("class", "label")
      .attr("x",  margin.left - 30)
      .attr("y", margin.left - 50  )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text("Budget");
});


// 1b 

d3.csv("movies.csv")
      .then(function(data) {

        data.forEach(function(d) {
          d.WinsNoms = +d.WinsNoms,
          d.Rating = +d.Rating,
          d.Budget = +d.Budget,
          d.IsGoodRating = +d.IsGoodRating,
          d.Votes = +d.Votes
        });

      var margin = {top: 80, right: 150, bottom: 120, left: 70},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      var svg3 = d3.select("#svg3").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("class", "pagebreak")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var data1 = data.map(function(d) {
          return [d.Rating, d.Votes, d.IsGoodRating, d.WinsNoms]
        }
      );

      x.domain(d3.extent(data1, function(d) { return d[0]; })).nice();
      y.domain(d3.extent(data1, function(d) { return d[1]; })).nice();


  // Add the x-axis.
    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        ;
 
    // Add the y-axis.
    svg3.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

  var getSize = d3.scaleLinear()
      .domain(d3.extent(data1, function(d) {
        return d[3];
      }))
      .nice()
      .range([5, 100]);

  // Add the points!
  svg3
  .selectAll('path')
  .data(data1)
  .enter()
  .append('path')
  .attr("stroke", function(d){return d[2] ? "blue":"red"})
  .attr('transform', function(d) {
    return "translate(" + x(d[0]) + "," + y(d[1]) + ")"; 
  })
  .attr("d", d3.symbol()
        .size(function(d) {
          return getSize(d[3]);
        })
        .type(function(d) {
          if (d[2] == 1)
            return d3.symbolCross;
          else if (d[2] == 0)
            return d3.symbolCircle;
        }));


  var legendData = [["bad rating", "red", "circle"], ["good rating", "blue", "cross"]];

  svg3.selectAll('.symbol')
     .data(legendData)
     .enter()
     .append('path')
     .attr('transform', function(d, i) {
       return 'translate(' + (width) + ',' + ((i * 20) + 10) + ')';
     })
     .attr('d', d3.symbol().type(function(d, i) {
         if (d[2] === "circle") {
           return d3.symbolCircle;
         } else if (d[2] === "cross") {
           return d3.symbolCross;
         } 
       })
       .size(25))
     .style("stroke", function(d) {
       return d[1];
     });

   svg3.selectAll('.label')
     .data(legendData)
     .enter()
     .append('text')
     .attr("x", width + 7.5)
     .attr("y", function(d, i){ return ((i * 20) + 12.5);})
     .text(function(d) {
       return d[0];
     });

    // Add Title 
  svg3.append("text")
    .attr("x", (width/2 - margin.right -25))
    .attr("y", 0)
    // .attr("class", "label")
    .attr("text-anchor", "right")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Votes vs. Rating sized by Wins+Nominations");

  // Add x-axis label
  svg3.append("text")
      // .attr("class", "label")
      .attr("x", width + margin.left - 25)
      .attr("y", height )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "end")
      .text("Rating");

     // Add y-axis label
  svg3.append("text")
      // .attr("class", "label")
      .attr("x",  margin.left - 40)
      .attr("y", margin.left - 55  )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text("Votes");
});

//Q3.c Part 1

d3.csv("movies.csv")
      .then(function(data) {

        data.forEach(function(d) {
          d.WinsNoms = +d.WinsNoms,
          d.Rating = +d.Rating,
          d.Budget = +d.Budget,
          d.IsGoodRating = +d.IsGoodRating,
          d.Votes = +d.Votes
        });

      var margin = {top: 80, right: 150, bottom: 120, left: 70},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleSqrt().range([height, 0]);

      var svg4 = d3.select("#svg4").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("class", "pagebreak")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var data1 = data.map(function(d) {
          return [d.Rating, d.Votes, d.IsGoodRating, d.WinsNoms]
        }
      );

      x.domain(d3.extent(data1, function(d) { return d[0]; })).nice();
      y.domain(d3.extent(data1, function(d) { return d[3]; })).nice();


  // Add the x-axis.
    svg4.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        ;
 
    // Add the y-axis.
    svg4.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

  // Add the points!
  svg4
  .selectAll('path')
  .data(data1)
  .enter()
  .append('path')
  .attr("stroke", function(d){return d[2] ? "blue":"red"})
  .attr('transform', function(d) {
    return "translate(" + x(d[0]) + "," + y(d[3]) + ")"; 
  })
  .attr("d", d3.symbol()
        .size(15)
        .type(function(d) {
          if (d[2] == 1)
            return d3.symbolCross;
          else if (d[2] == 0)
            return d3.symbolCircle;
        }));

  var legendData = [["bad rating", "red", "circle"], ["good rating", "blue", "cross"]];

  svg4.selectAll('.symbol')
     .data(legendData)
     .enter()
     .append('path')
     .attr('transform', function(d, i) {
       return 'translate(' + (width) + ',' + ((i * 20) + 10) + ')';
     })
     .attr('d', d3.symbol().type(function(d, i) {
         if (d[2] === "circle") {
           return d3.symbolCircle;
         } else if (d[2] === "cross") {
           return d3.symbolCross;
         } 
       })
       .size(25))
     .style("stroke", function(d) {
       return d[1];
     });

   svg4.selectAll('.label')
     .data(legendData)
     .enter()
     .append('text')
     .attr("x", width + 7.5)
     .attr("y", function(d, i){ return ((i * 20) + 12.5);})
     .text(function(d) {
       return d[0];
     });

    // Add Title 
  svg4.append("text")
    .attr("x", (width/2 - margin.right -25))
    .attr("y", 0)
    // .attr("class", "label")
    .attr("text-anchor", "right")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Wins+Nominations (square-root-scaled) vs. Rating");

  // Add x-axis label
  svg4.append("text")
      // .attr("class", "label")
      .attr("x", width + margin.left - 25)
      .attr("y", height )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "end")
      .text("Rating");

     // Add y-axis label
  svg4.append("text")
      .attr("x",  margin.left - 40)
      .attr("y", margin.left - 55  )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text("Wins+Noms");
});

//Q3.c Part 2

d3.csv("movies.csv")
      .then(function(data) {

        data.forEach(function(d) {
          d.WinsNoms = +d.WinsNoms,
          d.Rating = +d.Rating,
          d.Budget = +d.Budget,
          d.IsGoodRating = +d.IsGoodRating,
          d.Votes = +d.Votes
        });

      var margin = {top: 80, right: 150, bottom: 120, left: 70},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLog().range([height, 0]);

      var svg5 = d3.select("#svg5").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("class", "pagebreak")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var data1 = data.map(function(d) {
          return [d.Rating, d.Votes, d.IsGoodRating, d.WinsNoms]
        }
      );

      x.domain(d3.extent(data1, function(d) { return d[0]; })).nice();
      y.domain([1e-2, d3.max(data1, function(d) { return d[3]; })]).nice();


  // Add the x-axis.
    svg5.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        ;
 
    // Add the y-axis.
    svg5.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

  // Add the points!
  svg5
  .selectAll('path')
  .data(data1)
  .enter()
  .append('path')
  .attr("stroke", function(d){return d[2] ? "blue":"red"})
  .attr('transform', function(d) {
        if (d[3] == 0) {
          return "translate(" + x(d[0]) + "," + y(1e-2) + ")";
        } else {
          return "translate(" + x(d[0]) + "," + y(d[3]) + ")";
        }
      })
  .attr("d", d3.symbol()
        .size(15)
        .type(function(d) {
          if (d[2] == 1)
            return d3.symbolCross;
          else if (d[2] == 0)
            return d3.symbolCircle;
        }));

  var legendData = [["bad rating", "red", "circle"], ["good rating", "blue", "cross"]];

  svg5.selectAll('.symbol')
     .data(legendData)
     .enter()
     .append('path')
     .attr('transform', function(d, i) {
       return 'translate(' + (width) + ',' + ((i * 20) + 10) + ')';
     })
     .attr('d', d3.symbol().type(function(d, i) {
         if (d[2] === "circle") {
           return d3.symbolCircle;
         } else if (d[2] === "cross") {
           return d3.symbolCross;
         } 
       })
       .size(25))
     .style("stroke", function(d) {
       return d[1];
     });

   svg5.selectAll('.label')
     .data(legendData)
     .enter()
     .append('text')
     .attr("x", width + 7.5)
     .attr("y", function(d, i){ return ((i * 20) + 12.5);})
     .text(function(d) {
       return d[0];
     });

  // Add Title 
  svg5.append("text")
    .attr("x", (width/2 - margin.right -25))
    .attr("y", 0)
    // .attr("class", "label")
    .attr("text-anchor", "right")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Wins+Nominations (log-scaled) vs. Rating");

  // Add x-axis label
  svg5.append("text")
      // .attr("class", "label")
      .attr("x", width + margin.left - 25)
      .attr("y", height )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "end")
      .text("Rating");

  // Add y-axis label
  svg5.append("text")
      // .attr("class", "label")
      .attr("x",  margin.left - 40)
      .attr("y", margin.left - 55  )
      .attr("font-size", "11px")
      .attr("font-family", "sans-serif")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text("Wins+Noms");
});