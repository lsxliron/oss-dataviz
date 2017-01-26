var d3 = require('d3');
var $ = require('jquery');

function plotBarChart(month){

  var dataFile = 'data/' + month + '/fbTotal.json';
  
  d3.json(dataFile, function(err, data) {

    var max = d3.max(data, function(d) { return d.count });
    var min = d3.min(data, function(d) { return d.count });


    var categories= ['', 'Commit Comments', 'Forks', 'Stars', 'Pull Requests', 'Pull Requests Comments', 'Issues', 'Issue Comment',  'Commits'];

    var xscale = d3.scale.linear()
            .domain([min, max])
            .range([50, $(window).width()/4]);

    var yscale = d3.scale.linear()
            .domain([0,categories.length])
            .range([0,290]);

    var canvas = d3.select('.barChartDiv')
            .append('svg')
            .attr({'width':$(window).width()/2,'height':275})

    var yAxis = d3.svg.axis();
      yAxis
        .orient('left')
        .scale(yscale)
        .tickSize(0)
        .tickFormat(function(d,i){ return categories[i]; })

    var y_xis = canvas.append('g')
              .attr('transform', 'translate(220,0)')
              .attr('id','yaxis')
              .call(yAxis);

    var chart = canvas.append('g')
              .attr('transform', 'translate(220,0)')
              .attr('id','bars')
              .selectAll('rect')
              .data(data)
              .enter()
              .append('rect')
              .attr('height',19)
              .attr({'x':0,'y':function(d,i){ return yscale(i) + 22; }})
              .attr('width',function(d){ return 0; })
              .style('fill', '#52B6AC')


    var transit = d3.select('svg').selectAll('rect')
                .data(data)
                .transition()
                .duration(1000)
                .attr('width', function(d) { return xscale(d.count); })

    var transitext = d3.select('#bars')
              .selectAll('text')
              .data(data)
              .enter()
              .append('text')
              .attr({'x':function(d) {
                var numStr = d.count.toString().length
                return xscale(d.count)-10*numStr-10; 
              },'y':function(d,i){ return yscale(i) + 37; }})
              .text(function(d) { return d.count })
              .style({'fill':'#fff','font-size':'16px'});
  });

}

function updateBarChart(data){
  

  var categories= ['', 'Commit Comments', 'Forks', 'Stars', 'Pull Requests', 'Pull Requests Comments', 'Issues', 'Issue Comment',  'Commits'];
  
  var max = d3.max(data, function(d) { return d.count });
  var min = d3.min(data, function(d) { return d.count });
  
  
  var xscale = d3.scale.linear()
            .domain([min, max])
            .range([50, $(window).width()/4]);

  var yscale = d3.scale.linear()
            .domain([0,categories.length])
            .range([0,290]);

  var canvas = d3.select('.barChartDiv').select('svg')
  
  var chart = canvas.selectAll('rect').data(data)
                    .attr('height',19)
                    .attr({'x':0,'y':function(d,i){ return yscale(i) + 22; }})
                    .transition().duration(1000)
                    .attr('width',function(d){ return xscale(d.count); })
                    

  var transitext = d3.select('#bars')
                    .selectAll('text')
                    .data(data)
                    .text(function(d) { return d.count })
                    .transition().duration(1000)
                    .attr({'x':function(d) {
                      var numStr = d.count.toString().length
                      return xscale(d.count)-10*numStr-10; 
                    },'y':function(d,i){ return yscale(i) + 37; }})
                    
  


}

module.exports = {
  plotBarChart:plotBarChart,
  updateBarChart:updateBarChart
}