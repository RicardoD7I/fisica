

	function drawCaudalHorizontal(data){
		$("#placeholder").show();

				$.plotAnimator("#placeholder", [
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
		
		incrementLine(1, 330);
		
	}
	
	
	function cleanUI() {
	$("#placeholder").hide();
		$("#line").css("height", "0px");
	}