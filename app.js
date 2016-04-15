var margin = {top: 50, right: 0, bottom: 150, left: 50};
var width = 970 - margin.left - margin.right;
var height = 500- margin.top - margin.bottom;
var gridSize = Math.floor(width/15);
var legendWidth = gridSize;

var colors = ["#00ff55", "#00802b", "#fbfb00", "#f7ab0d", "#e65c00", "#ff2f44", "#ff0000",];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var datasets = ["data/jan.tsv", "data/feb.tsv", "data/mar.tsv", "data/apr.tsv", "data/may.tsv", "data/jun.tsv", "data/jul.tsv", "data/aug.tsv", "data/sep.tsv", "data/oct.tsv", "data/nov.tsv", "data/dec.tsv"];
var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


var svg = d3.select('.container').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate('+margin.left+','+margin.top+')')

var monthTitle = d3.select("#month-label")
	.html(fullMonths[0]);	
// var monthLabel = svg.append('text')
// 	. //put in function that takes in current dataset

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
			var colorScale = d3.scale.quantile()
				.domain([7, 14, 15, 60, 61, 550, 950, 1200, 1500])
				.range(colors);



			var tiles = svg.selectAll(".day")
				.data(data, function(d){return d.day;});

			tiles.append("title");



			tiles.enter().append("rect")
				.attr("x", function(d) {return ((d.day % 7)) * gridSize + 223;})
				.attr("y", function(d) {return (d.week - 1) * gridSize;})
				.attr("rx", 4)
				.attr("ry", 4)
				.attr("class", "day bordered")
				.attr("width", gridSize)
				.attr("height", gridSize)
				.style("fill", "#ffffd9");

			

			tiles.transition().duration(800)
				.style("fill", function(d) {return colorScale(d.value);})
				.style("opacity", "1");

			tiles.select("title").text(function(d) {
				return d.value; 
			});

			tiles.enter().append("text")
				.attr("x", function(d) {return (d.day % 7) * gridSize + 263;})
				.attr("y", function(d) {return(d.week - 1) * gridSize + 56;})
				.attr("class", "numbers")
				.style("fill", "black")
				.text(function(d) {return d.day + 1;})
				

			tiles.filter(function(d){ return d.value == -1; }).transition().duration(800)
				.style("fill", "#cccccc");

			tiles.exit().remove();

			var legend = svg.selectAll(".legend")
				.data([0].concat(colorScale.quantiles()), function(d){return d;});

			legend.enter().append("g")
				.attr("class", "legend");

			legend.append("rect")
	            .attr("x", function(d, i) { return (legendWidth * i) + 223; })
	            .attr("y", height + 70)
	            .attr("width", legendWidth)
	            .attr("height", gridSize / 6)
	            .style("fill", function(d, i) { return colors[i]; });

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




