var margin = {top: 50, right: 0, bottom: 150, left: 50};
var width = 970 - margin.left - margin.right;
var height = 500- margin.top - margin.bottom;
var gridSize = Math.floor(width/15);
var legendWidth = gridSize;


//Define preset color array to map data to
var colors = ["#00ff55", "#00802b", "#fbfb00", "#f7ab0d", "#e65c00", "#ff2f44", "#ff0000",];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var datasets = ["data/jan.tsv", "data/feb.tsv", "data/mar.tsv", "data/apr.tsv", "data/may.tsv", "data/jun.tsv", "data/jul.tsv", "data/aug.tsv", "data/sep.tsv", "data/oct.tsv", "data/nov.tsv", "data/dec.tsv"];
var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//Creation of svg container
var svg = d3.select('.container').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate('+margin.left+','+margin.top+')')

//Select the month-label div and start with the first month 'January'
var monthTitle = d3.select("#month-label")
	.html(fullMonths[0]);	

/** Creation of the tree pollen level chart
	Takes in .tsv file and converts attributes to integers
**/
var pollenChart = function(tsvFile){
	d3.tsv(tsvFile, 
		function(d){
			return {
				month: parseInt(d.month),
				week: parseInt(d.week),
				day: parseInt(d.day),
				value: parseInt(d.value)
			};
		},
		function(err, data){

			//Uses d3 quantile() scale to map data to predefined buckets of colors and ranges
			var colorScale = d3.scale.quantile()
				.domain([7, 14, 15, 60, 61, 550, 950, 1200, 1500])
				.range(colors);


			//Initializes tiles using d3 selectAll()
			var tiles = svg.selectAll(".day")
				.data(data, function(d){return d.day;});

			tiles.append("title");


			//Appends a rectangle to each .day
			//Uses math to calculate correct coordinates
			tiles.enter().append("rect")
				.attr("x", function(d) {return ((d.day % 7)) * gridSize + 223;})
				.attr("y", function(d) {return (d.week - 1) * gridSize;})
				.attr("rx", 4)
				.attr("ry", 4)
				.attr("class", "day bordered")
				.attr("width", gridSize)
				.attr("height", gridSize)
				.style("fill", "#ffffd9");

			
			//Transition for color changes
			tiles.transition().duration(800)
				.style("fill", function(d) {return colorScale(d.value);})
				.style("opacity", "1");

			tiles.select("title").text(function(d) {
				return d.value; 
			});

			//Appends and positions a number to indicate the day
			tiles.enter().append("text")
				.attr("x", function(d) {return (d.day % 7) * gridSize + 263;})
				.attr("y", function(d) {return(d.week - 1) * gridSize + 56;})
				.attr("class", "numbers")
				.style("fill", "black")
				.text(function(d) {return d.day + 1;})
				

			//Greys out days if the day does not exist in the month
			tiles.filter(function(d){ return d.value == -1; }).transition().duration(800)
				.style("fill", "#cccccc");

			tiles.exit().remove();

			//Initializes the legend by using d3 selectAll()
			//Ensures all colors are passed in as data
			var legend = svg.selectAll(".legend")
				.data([0].concat(colorScale.quantiles()));

			legend.enter().append("g")
				.attr("class", "legend");

			//Appends a rectangle with the correct color to the legend
			legend.append("rect")
	            .attr("x", function(d, i) { return (legendWidth * i) + 223; })
	            .attr("y", height + 70)
	            .attr("width", legendWidth)
	            .attr("height", gridSize / 6)
	            .style("fill", function(d, i) { return colors[i]; });

	        //Append correct quantile to corresponding color and positions text below rectangle
          	legend.append("text")
		        .attr("class", "mono")
		        .text(function(d) { return "≥ " + Math.round(d); })
		        .attr("x", function(d, i) { return legendWidth * i + 223; })
		        .attr("y", height + gridSize + 40);

          	legend.exit().remove();

        });
	};
	  pollenChart(datasets[0]);
      
      var datasetpicker = d3.select("#month-picker").selectAll(".dataset-button")
        .data(datasets);

      //Assigns click event to button such that when button is clicked, the month and dataset is changed to the one selected
      datasetpicker.enter()
        .append("input")
        .attr("value", function(d, i){ return months[i]; })
        .attr("type", "button")
        .attr("class", "dataset-button")
        .on("click", function(d) {
        	var monthtitle = d3.select("#month-label")
        		.html(fullMonths[datasets.indexOf(d)]);	

          pollenChart(d);
        });




