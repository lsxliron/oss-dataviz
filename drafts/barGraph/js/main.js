var dataFile = '../barGraphData/fbTotal.json';
d3.json(dataFile, function(err, data) {

  var max = d3.max(data, function(d) { return d.count });
  var min = d3.min(data, function(d) { return d.count });

  var linScale = d3.scale.log()
    .domain([min, max])
    .range([250, 700]);

  var categories= ['', 'CommitCommentEvent', 'ForkEvent', 'WatchEvent', 'PullRequestEvent', 'PullRequestReviewCommentEvent', 'IssuesEvent', 'IssueCommentEvent',  'PushEvent'];

  var xscale = d3.scale.log()
          .domain([min, max])
          .range([250, 700]);

  var yscale = d3.scale.linear()
          .domain([0,categories.length])
          .range([0,480]);

  var canvas = d3.select('#chart')
          .append('svg')
          .attr({'width':900,'height':550});

  var yAxis = d3.svg.axis();
    yAxis
      .orient('left')
      .scale(yscale)
      .tickSize(0)
      .tickFormat(function(d,i){ return categories[i]; })

  var y_xis = canvas.append('g')
            .attr('transform', 'translate(180,0)')
            .attr('id','yaxis')
            .call(yAxis);

  var chart = canvas.append('g')
            .attr('transform', 'translate(180,0)')
            .attr('id','bars')
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('height',19)
            .attr({'x':0,'y':function(d,i){ return yscale(i) + 45; }})
            .attr('width',function(d){ return 0; })
            .style('fill', 'steelblue')


  var transit = d3.select('svg').selectAll('rect')
              .data(data)
              .transition()
              .duration(1000)
              .attr('width', function(d) {return xscale(d.count); })

  var transitext = d3.select('#bars')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr({'x':function(d) {return xscale(d.count) - 45; },'y':function(d,i){ return yscale(i) + 60; }})
            .text(function(d) { return d.count })
            .style({'fill':'#fff','font-size':'16px'});
});