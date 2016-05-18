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

//Hack to remove months from tick labels when user chose total
$(document).ready(function(){
  setTimeout(function(){
    if ($('#selectedMonth').val() == '0'){
      var ticks = d3.selectAll('.x.axis').selectAll('.tick').selectAll('text')
      console.log(ticks)
      $.each(ticks, function(i, d){
        $(d).text($(d).text().slice(4));
      })
    }
  },1)
})


function init(){
  months={'Total': 0, 'January': 1, 'February': 2, 'March': 3, 'April': 4}
  
  plotTreemap($("#selectedMonth").val())
  plotBarChart($("#selectedMonth").val())
  plotTimeSeries($("#selectedMonth").val())
  console.log(typeof($('#selectedMonth').val()))
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
