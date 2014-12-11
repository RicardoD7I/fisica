

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
	
 $("input[name='demo_vertical2']").TouchSpin({
      verticalbuttons: true,
      verticalupclass: 'glyphicon glyphicon-plus',
      verticaldownclass: 'glyphicon glyphicon-minus',
	      min: 0,
        max: 100,
        step: 0.1,
        decimals: 2
    });
	
	
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
