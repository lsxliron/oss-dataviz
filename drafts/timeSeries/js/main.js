var margin = {top: 75, right: 20, bottom: 70, left: 50}, 
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;  

// Color hash will be used for coloring each line
var color_hash = {  
  0 : ['#ff6961'],
  1 : ['#61a8ff'],
  2 : ['#61ffb8'],
  3 : ['#917394']
} 

// Used for creating the legend
// Colors correspond to the line color order
var legend_hash = {
  0 : ['Commits', '#ff6961'],
  1 : ['Pull Requests', '#61a8ff'],
  2 : ['Pull Request Comments', '#61ffb8'],
  3 : ['Issues', '#917394']
}

// Parse the date / time
var parseDate = d3.time.format('%b %d').parse; 

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient('bottom').ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient('left').ticks(5);

// Define the line object
var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); })
    
// Adds the svg canvas
var svg = d3.select('body')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform', 
              'translate(' + margin.left + ',' + margin.top + ')');

// Load our dataset
d3.json('weekly.json', function(err, data) {

  // Parse the dates and counts
  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.count = d.count;
  });

  // Scale dates and count values
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]); 

  // Used to group objects by keys
  var dataNest = d3.nest()
      .key(function(d) {return d.name;})
      .entries(data);

  // For each array of keys (commits, stars, etc), create a line
  dataNest.forEach(function(d) {
    svg.append('path')
      .attr('class', 'line')
      .attr('stroke', color_hash[dataNest.indexOf(d)])
      .attr('d', line(d.values))
      .attr('id', 'tag' + d.key.replace(/\s+/g, ''));
  });

  // Initialize Tooltip object
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return '<strong>' + d.name + ':' +  "</strong> <span style='color:white'>" +  d.count + '</span>'
    });

  // Display tooltips
  svg.call(tip);

  // Create circles around all points
  var circles = svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle');

  circles
    .attr('cx', function (d) { return x(d.date) })
    .attr('cy', function (d) { return y(d.count) })
    .attr('r', function (d) { return 5 })
    .attr('id', function (d) { return 'circle' + d.name.replace(/\s+/g, '')})
    .style('stroke', '#917394')
    .style('fill', '#ffffff' )
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // Create x-axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  // Create y-axis
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  // Create Title
  svg.append('text')
    .attr('x', (width / 2))             
    .attr('y', 0 - (margin.top / 2))
    .attr('text-anchor', 'middle')  
    .style('font-size', '16px') 
    .style('text-decoration', 'underline')  
    .text('Total Activity');

  // Legend dimensions
  legendSpace = width/dataNest.length;

  // Loop through each symbol / key
  dataNest.forEach(function(d,i) {
    // Add the Legend
    svg.append('text')                                   
      .attr('x', (legendSpace/2)+i*legendSpace)
      .attr('y', height + (margin.bottom/2) + 15)        
      .attr('class', 'legend') 
      .style('fill', function() { return color_hash[String(i)] })
      .on('click', function() {                    
        var active   = d.active ? false : true,   
        newOpacity = active ? 0 : 1; 

        // Hide or show the elements based on the ID
        d3.select('#tag'+ d.key.replace(/\s+/g, '')) 
          .transition().duration(500)          
          .style('opacity', newOpacity); 

        d3.selectAll('#circle'+ d.key.replace(/\s+/g, '')) 
          .transition().duration(500)          
          .style('opacity', newOpacity);  

        // Update whether or not the elements are active
        d.active = active;                       
      })
      .text(d.key)
  });
});