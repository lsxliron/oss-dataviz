function plot(){


  var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var color = d3.scale.category20c();

  var treemap = d3.layout.treemap()
                  .size([width, height])
                  .sticky(true)
                  .value(function(d){return d.WatchEvent+100});
  // var svg = d3.select('body').append('svg').size

  var div = d3.select('body').append('div')
              .style("position", "relative")
              .style("width", (width + margin.left + margin.right) + "px")
              .style("height", (height + margin.top + margin.bottom) + "px")
              .style("left", margin.left + "px")
              .style("top", margin.top + "px");


  d3.json("treemapData.json", function(error, root){
    if (error) throw error;

    var node = div.datum(root).selectAll(".node")
                  .data(treemap.nodes)
                  .enter().append('div')
                  .attr('class', 'node')
                  .call(position)
                  .style("background", function(d) { return d.children ? color(d.name) : null; })
                  .text(function(d) { return d.children ? null : d.name; })
                  .on('mouseover', function(){
                    d3.select(this).transition().duration(500)
                      .style('z-index','100')
                      .style('width', function(d){ return d.dx*4 + 'px'; })
                      .style('height', function(d){ return d.dy*2 + 'px'; })
                      .style('left', function(d){ return d.x - d.dx/2 + 'px'; })
                      .style('top', function(d){ return d.y - d.dy/2 + 'px'; })
                      .style('background-color',function(d){return 'red'})
                      
                  })

                  .on('mouseout', function(){
                    d3.select(this).transition().duration(500)
                      .style('width', function(d){ return d.dx + 'px'; })
                      .style('height', function(d){ return d.dy + 'px'; })
                      .style('left', function(d){ return d.x + 'px'; })
                      .style('top', function(d){ return d.y + 'px'; })
                      .style('background-color',function(d){return null})
                      .style('z-index','0')
                  })


    d3.selectAll('input').on('change', function change(){
      // var value = this.value === "Forks"
      var value;
      if (this.value == "Forks")
           value = function(d){return d.ForkEvent + 100}
      else if (this.value == "Stars")
            value =  function(d){return d.WatchEvent + 100}
      else if (this.value == "Pulls")
            value =  function(d){return d.PullRequestEvent + 100}
      else if (this.value == "IssueCommentEvent")
            value =  function(d){return d.IssueCommentEvent + 100}
      else if (this.value == "PushEvent")
            value =  function(d){return d.PushEvent + 100}

      node.data(treemap.value(value).nodes)
          .transition().duration(1500)
          .call(position)
      });
    });
}

function position(){
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });

}


// {
//   "name" : "repos",
//       "children" : 
//       [
//         {"name" : "child1Level2", "size": 500},
//         {"name" : "child1Level2", "size": 400},
//         {"name" : "child1Level2", "size": 300},
//         {"name" : "child1Level2", "size": 200},
//         {"name" : "child1Level2", "size": 100}
//       ]
    
  
// }