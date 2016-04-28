var angle;

(function(){
  plotTreemap()
  plotBarChart()  

  $('#refresh').on('click', function(){
    var angleMatrix = $('#loopIcon').css('transform');
    if (angleMatrix == 'none')
      angle = 360;
    else
      angle+=360;
    $("#loopIcon").css({'transform': 'rotate('+angle+'deg)', 'transition': 'all 500ms ease-in'})
    getFBTotal();
  })
})()

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
