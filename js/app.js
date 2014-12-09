

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
		
			var vaciadoDeTanque = 32;
		
			
			cleanUI();
			$("#charco").removeClass("charco_horizontal").removeClass("charco_vertical");
			$("#charco").addClass("hidden");
			$("#water").remove();
			$("#water_cont").append('<div id="water" class="water forma-agua"></div>');
			
			// ver tipo de simulacion
			var tipo_simulacion= $("#tipo_simulacion").val();
			if (tipo_simulacion == "vertical") {
			  vaciadoDeTanque = 0;
			}

			// simular
			vaciarTanque(vaciadoDeTanque );
			simulaciones[tipo_simulacion]();
			
				

		});
		

	});
