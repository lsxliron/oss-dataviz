var angle;
var months

(function(){
  
  $(".dropdown-button").dropdown();

  init()

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


  $(".month").on('click', function(event){
    d3.selectAll('.treemapDiv').selectAll('.node').remove()
    d3.selectAll('svg').remove()
    $('#selectedMonth').val((months[$(this).text()])) 
    $('#navDropdown').text(($(this).text()))  
    init()
    event.preventDefault()
    
  })


})()


function init(){
  months={'February': 2, March: 3,April: 4}
  
  plotTreemap($("#selectedMonth").val())
  plotBarChart($("#selectedMonth").val())
  plotTimeSeries($("#selectedMonth").val())
}
function getTimeSeriesTotal(){
  $.ajax({
    dataType: 'json',
    url: 'data/'+$("#selectedMonth").val()+'/weekly.json',
    success: function(data){
      updateTimeSeries(data);
    }
  })
}

function getFBTotal(){
  $.ajax({
    dataType: "json",
    url: "data/"+$("#selectedMonth").val()+"/fbTotal.json",
    success: function(data){
      updateBarChart(data)
      $('#selectedRepoTitle').text('Bar Chart: All Reporistories');
    }
  })
}
