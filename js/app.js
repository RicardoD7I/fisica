

	$(function() {
	

	
	var simulaciones = {
		
		vertical : function() {
			// dibujar el caudal vertical
			drawCuadalVertical();
		},
		
		horizontal : function() {
			// dibujar el caudal horizontal
			var data = getCaudalHorizontalData();
			drawCaudalHorizontal(data);
		}
	
	}
	
	
		$("#simular").click(function(){
			
			cleanUI();
			
			// ver tipo de simulacion
			var tipo_simulacion= $("#tipo_simulacion").val();

			// simular
			simulaciones[tipo_simulacion]();
		
		});
		

	});
