	function getCaudalHorizontalData(reduce, limit){
	
	var a = -1;
	var b = 0;
	var c = 0
		var d1 = [];
		
		if (!limit) limit = 5;
		
		if (reduce) {
		  a = a - reduce;
		}
		
		for (var i = 0; i <= limit; i += 0.5) {
		var result = cuadratica(a,b,c, i)
				
		// limite del suelo
		if (result >= -24) {
		  d1.push([i, result]);
	    }
	
			
		}
		return d1;
	}
	
	
	function cuadratica(a,b,c, x) {
	  return a * (x*x) + b *x + c
	}