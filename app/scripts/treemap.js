function plotTreemap(month){

  var margin = {top: -20, right: 40, bottom: 10, left: 10},
    width = $(window).width() - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var color = d3.scale.category20c();
  var treemap = d3.layout.treemap()
                  .size([width, height])
                  .sticky(true)
                  .value(function(d){return d.WatchEvent+100});
  

  var div = d3.select(".treemapDiv")
              .style("position", "relative")
              .style("width", (width + margin.left + margin.right) + "px")
              .style("height", (height + margin.top + margin.bottom) + "px")
              .style("left", margin.left + "px")
              .style("top", margin.top + "px");


  d3.json("data/" + month + "/treemapData.json", function(error, root){
    if (error) throw error;

    var node = div.datum(root).selectAll(".node")
                  .data(treemap.nodes)
                  .enter().append('div')
                  .attr('class', 'node')
                  .call(position)
                  .style("background", function(d) { return d.children ? color(d.name) : null; })
                  .text(function(d) { return d.children ? null : d.name; })
                  .on('click', function(d){ 
                    updateBarChart(getDataForBarChart(d)); 
                    getTimeSeriesData(d);
                    $('#selectedRepoTitle').text("Bar Chart: " + d.name)
                  })
                  .on('mouseover', function(d){
                    $('#selectedRepo').text("Hovered reop: " + d.name)
                  })
                  .on('mouseout', function(){
                    $('#selectedRepo').text("Hovered repo: none")
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

      // if (this.value == "Forks")
      //      value = function(d){return d.ForkEvent}
      // else if (this.value == "Stars")
      //       value =  function(d){return d.WatchEvent}
      // else if (this.value == "Pulls")
      //       value =  function(d){return d.PullRequestEvent}
      // else if (this.value == "IssueCommentEvent")
      //       value =  function(d){return d.IssueCommentEvent}
      // else if (this.value == "PushEvent")
      //       value =  function(d){return d.PushEvent}
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


function getRepoData(d){
  // return d.name + "<tspan>" + "Stars: " + d.WatchEvent 
  return d.name + "<br>" + 
        "Stars: " + d.WatchEvent + "<br>" + 
        "Forks: " + d.ForkEvent + "<br>" + 
        "Pulls: "  + d.PullRequestEvent + "<br>" +
        "Issues Comments: " + d.IssueCommentEvent + "<br>" +
        "Push Events: " + d.IssueCommentEvent + "<br>";
}

function getDataForBarChart(d){
  data = [
  {
    name: "CommitCommentEvent",
    count: d.CommitCommentEvent
  },
  {
    name: "ForkEvent",
    count: d.ForkEvent
  },
  {
    name:"WatchEvent",
    count: d.WatchEvent
  },
  {
    name: "PullRequestEvent",
    count: d.PullRequestEvent
  },
  {
    name: "PullRequestReviewCommentEvent",
    count: d.PullRequestReviewCommentEvent
  },
  {
    name: "IssuesEvent",
    count: d.IssuesEvent
  },
  {
    name: "IssueCommentEvent",
    count: d.IssueCommentEvent
  },
  {
    name: "PushEvent",
    count: d.PushEvent
  }]
  return data
}


function getTimeSeriesData(repo){
  $.ajax({
    dataType: 'json',
    async: false,
    url: 'data/wdata.json',
    success: function(data){
      updateTimeSeries(data[repo.name]);
    }
  })
}
