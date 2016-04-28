var angle;

(function(){
  plotTreemap()
  plotBarChart()  
  plotTimeSeries()

  $('#refresh').on('click', function(){
    var angleMatrix = $('#loopIcon').css('transform');
    if (angleMatrix == 'none')
      angle = 360;
    else
      angle+=360;
    $("#loopIcon").css({'transform': 'rotate('+angle+'deg)', 'transition': 'all 500ms ease-in'})
    getFBTotal();
    getTimeSeriesTotal();
  })
})()

function getTimeSeriesTotal(){
  $.ajax({
    dataType: 'json',
    url: 'data/weekly.json',
    success: function(data){
      updateTimeSeries(data);
    }
  })
}

function getFBTotal(){
  $.ajax({
    dataType: "json",
    url: "data/fbTotal.json",
    success: function(data){
      updateBarChart(data)
      $('#selectedRepoTitle').text('Bar Chart: All Reporistories');
    }
  })
}
