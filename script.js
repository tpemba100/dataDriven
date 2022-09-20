

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date for pointer tip
var parseTime = d3.timeParse("%d-%b-%y"),
    formatDate = d3.timeFormat("%d-%b"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left;



// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#cont").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "chart")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Adding a separate group to 'layer' the objects
var lineSvg = svg.append("g");

var focus = svg.append("g") 
    .style("display", "none");

// Get the data
d3.csv("datastock.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
      
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // Add the valueline path.
  lineSvg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the x line
  focus.append("line")
      .attr("class", "x")
      .style("stroke", "red")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.5)
      .attr("y1", 0)
      .attr("y2", height);

  // append the y line
  focus.append("line")
      .attr("class", "y")
      .style("stroke", "red")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.5)
      .attr("x1", width)
      .attr("x2", width);

  // append the circle at the intersection 
  focus.append("circle")
      .attr("class", "y")
      .style("fill", "none")
      .style("stroke", "red")
      .attr("r", 4);

    // place the value at the intersection
    focus.append("text")
        .attr("class", "y1")
        .style("stroke", "none")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // place the date at the intersection
    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "none")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");
  
  // append the rectangle to capture mouse
  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { 
          focus.style("display", "none"); 
          tooltip.style("visibility", "hidden");
      })
      .on("mousemove", mousemove);
  
  
  
  // set the gradient
  svg.append("linearGradient")				
    .attr("id", "line-gradient")			
    .attr("gradientUnits", "userSpaceOnUse")	
    .attr("x1", 0).attr("y1", y(0))			
    .attr("x2", 0).attr("y2", y(1000))		
  .selectAll("stop")						
    .data([								
      {offset: "0%", color: "red"},		
      {offset: "49%", color: "red"},	
      {offset: "49%", color: "green"},		
      {offset: "100%", color: "green"},			
    ])					
  .enter().append("stop")			
    .attr("offset", function(d) { return d.offset; })	
    .attr("stop-color", function(d) { return d.color; });
  
  
  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);
  
  
  
  //append a div and class to body
  var tooltip = d3.select("#cont")
    .append("div")
    .attr("class", "info");
  
  
 // add the dots 
  svg.selectAll("dot")
     .data(data)
   .enter().append("circle")
     .attr("r", 4)
     .attr("cx", function(d) { return x(d.date); })
     .attr("cy", function(d) { return y(d.close); })
     .style("fill","white");
     

  function mousemove() {
	  var x0 = x.invert(d3.pointer(event,this)[0]),
		  i = bisectDate(data, x0, 1),
		  d0 = data[i - 1],
		  d1 = data[i],
		  d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    

    
    
  tooltip.html("<p>" + d.symbol+"</p>"
               + "<p>"+ d.cleandate + "</p>" 
               +"<p>"+ d.close +"</p>"
               +"<p>"+ d.info + "</p")
    .style("visibility", "visible")
    .style ("background-color", "red")
  
    
    
  

	focus.select("circle.y")
	   .attr("transform",
	         "translate(" + x(d.date) + "," +
	                        y(d.close) + ")");

		focus.select("text.y1")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.close) + ")")
		    .text(d.close);

		focus.select("text.y2")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.close) + ")")
		    .text(d.close);

		focus.select("text.y3")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.close) + ")")
		    .text(formatDate(d.date));

		focus.select("text.y4")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.close) + ")")
		    .text(formatDate(d.date));

		focus.select(".x")
		    .attr("transform",
		          "translate(" + x(d.date) + "," +
		                         y(d.close) + ")")
		               .attr("y2", height - y(d.close));

		focus.select(".y")
		    .attr("transform",
		          "translate(" + width * -1 + "," +
		                         y(d.close) + ")")
		               .attr("x2", width + width);
    
  }
  
});