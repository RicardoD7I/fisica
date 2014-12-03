(function($) {
	$.fn.lower = function(options) {
	
		options = $.extend({
			speed: 1000,
			max: '100%',
			background: '#fff'
		}, options);
		
		return this.each(function() {
			var $element = $(this);
			$element.prepend('<div class="lower"></div>');
		//	$('div.lower', $element).css('backgroundColor', options.background);
			
			$('div.lower', $element).animate({
				height: options.max
			}, options.speed);
		});
	};

})(jQuery);


var plot = null;

	function drawCaudalHorizontal(data){
		$("#eje_coord").show();

			plot =	$.plotAnimator("#eje_coord", [
			{ label: "Chorro de agua", data: data,  color: "#00BFFF",
              lines: {
              lineWidth: 1,
              fillColor: {
              colors: [{ opacity: 1 }, { opacity: 1 } ]
        }
    } }
		], {
			series: {
				lines: { show: true },
			},
			 yaxis:
    {
        min:-24, max: 0,  tickSize: 5 
    },
		 xaxis:
    {
        min:0, max: 24,  tickSize: 5 
    },
	
			grid: {
				borderWidth: {
					top: 1,
					right: 1,
					bottom: 2,
					left: 2
				}
			}
		});
		
	}
	
	
	function reDraw() {
	//time passes, you now want to replot

var newData = [[0,2],[1,3],[2,5]];

plot.setData(newData);
plot.setupGrid(); //only necessary if your new data will change the axes or grid
plot.draw();
	
	}
	
	
		function drawCuadalVertical() {
		var rate =  1;
		var rateSeconds = 1;
		
		var incrementLine = function(initial, end){
		if (end >= initial ) {
			setTimeout(function(){
				//alert(initial)
				$('#line').height(initial); 
				incrementLine(initial + rate, end)
			}, rateSeconds);
		
		}
	
		}
		
		incrementLine(1, 200);
		
	}
	
	
	function cleanUI() {
	    $("#eje_coord").hide();
		$("#line").css("height", "0px");
		$("#water").remove();
		$("#water_cont").append('<div id="water" class="water forma-agua"></div>');
	}
	
	
	function vaciarTanque(limit) {
		var size = 100;
		if (limit) {
			size = size - limit;
		}
	
	
		$("#water").lower({
			max : size + "px"
		});
	}