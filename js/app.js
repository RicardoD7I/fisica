

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
			$("#charco").removeClass("charco_horizontal").removeClass("charco_vertical");
			$("#charco").addClass("hidden");
			$("#water").remove();
			$("#water_cont").append('<div id="water" class="water forma-agua"></div>');
			
			// ver tipo de simulacion
			var tipo_simulacion= $("#tipo_simulacion").val();

			// simular
			vaciarTanque(32 );
			simulaciones[tipo_simulacion]();
			
				

		});
		

	});
