	function getCaudalHorizontalData(){
		var d1 = [];
		for (var i = 0; i <= 24; i += 0.5) {
		var result = (-i ) * i;
		
		// limite del suelo
		if (result >= -24) {
		  d1.push([i, result ]);
	    }
	
			
		}
		console.log(d1);
		return d1;
	}
	