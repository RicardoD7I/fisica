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



	function drawCaudalHorizontal(data, notAnimated){
		var plotter = "plotAnimator";
	
		$("#eje_coord").show();
		cleanUI(); 
	
		if (notAnimated) {
		 plotter = "plot";
		}
		
		$("#eje_coord").on("animatorComplete", function() {
				$(this).off();
				drawCharco(0, 100, "horizontal");
				setTimeout(function(){
					update();
				
				}, 1000)
				
		});
		
		return $[plotter](
			$("#eje_coord"), 
			getPlotSettings(data), 
			getGridOptions()
		);
		

		
		
	}
	
	
	function getPlotSettings(data){
	
	  return [{ 
	          label: "Chorro de agua", data: data,  color: "#00BFFF",
              lines: {
                lineWidth: 1,
                fillColor: {
                  colors: [{ opacity: 1 }, { opacity: 1 } ]
                }
              } 
			}];
	
	}
	
	function getGridOptions () {
	
	return {
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
		};
	
	}
	
	function reDraw(val) {
		setTimeout(function(){
			if (val > 0) {
			   var data = getCaudalHorizontalData(val - 0.5, val);
			   drawCaudalHorizontal(data, true)
			   reDraw(val - 0.5)
			} else {
				drawCaudalHorizontal(null, true)
			}
		}, 50 + (val * 20));
	}

		
		function update() {

		  reDraw(5)

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
		
		} else { 
			drawCharco(0, 200, "vertical");
			
			var decrementLine = function(initial, end){
			  alert(end);
			  alert(initial);
		      if (end >= initial ) {
			    setTimeout(function(){
				  
				  $('#line').css("margin-top", initial); 
				  decrementLine(initial + rate, end)
  			    }, rateSeconds);
		      } 
	        }
			decrementLine(1, 200);
		}
	
		}
		
		incrementLine(1, 200);
		
	}
	
	
	function cleanUI() {
	    $("#eje_coord").unbind();
		$("#line").css("height", "0px").css("margin-top", "0px");
		$("#eje_coord").remove();
		$("#cont").append('<div id="eje_coord" class="eje_coord"></div>');
	
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
	
	function drawCharco(init, end, tipo_animacion){
	

		var charco = $("#charco");
		if (typeof tipo_animacion != "undefined") {
		  charco.addClass("charco_" + tipo_animacion);
		}
		charco.removeClass("hidden");
	
		setTimeout(function(){
			var width = charco.css("width");
			var bottom = parseInt(charco.css("bottom").replace("px", ""), 10);
			if (end >= init) {
				charco.css("width", init);
				drawCharco(init + 1, end);
			}
		
		},5)
	
	
	}