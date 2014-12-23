

$(function() {

	var stop = false;
	
	var config = {
		screen : {
			width: 800 ,
			height: 600
		},
		aguaDelTanque : {
			height:260
		}
	}
	
	var c = document.getElementsByTagName('canvas')[0];
    var canvas = new Canvas2d(c);

    var mathFn = new MathFunction(185, 358, function (t) {
        return posFinal(0, 0, 15, 10, 0, -GRAVEDAD, t/60);
    }, 0, 0, .5, null, null, 5, 'blue');

    var agua = new Rectangle(55, config.aguaDelTanque.height, 150, 100, 'rgba(0, 0, 255, .5', 0);

    var info = new StyledText("", 790, 10, "bold large sans-serif", 'red', 'right', 'top');
	var tanque = new Rectangle(0, 237, 240, 363, 'transparent', 'img/tanque.png');

    canvas.elements.push(new Rectangle(0, 0, config.screen.width, config.screen.height, 'white', 'css/fondo2.png'));
    canvas.elements.push(tanque);
    canvas.elements.push(new StyledText("Simulador", 10, 10, "bold large sans-serif", 'red', 'left', 'top'));
    canvas.elements.push(agua);
    canvas.elements.push(info);
    canvas.elements.push(mathFn);

    function update () {
        agua.y+=1/3;
        agua.height = 360 - agua.y;
        if (agua.y >= 360) {
            agua.y = config.aguaDelTanque.height;
        }


        mathFn.to++;
        if (mathFn.to == 300) {
			mathFn.to = 0;
			stop = true;
		}

        info.text = "Tiempo: " + Math.floor(mathFn.to / 60).toString() + " seg";

		
		if (!stop) {
			canvas.frame(update);
		}
		
        
    }
	
	// init
    canvas.frame(function tt(){  canvas.frame(tt);  });


	// para seleccion de valores
	$("input[name='demo_vertical2']").TouchSpin({
      verticalbuttons: true,
      verticalupclass: 'glyphicon glyphicon-plus',
      verticaldownclass: 'glyphicon glyphicon-minus',
	     min: 0,
        max: 100,
        step: 0.1,
        decimals: 2
    });
	
	 // para la tapa del tanque
	 $("input[name='tapa_del_tanque']").on("click", function(){
		tanque.image.src = $(this).val();;
		tanque.paint(canvas);
	 });
	
	// inciar la simulacion
	$("#simular").click(function(){
		stop = false;
		update();
	});
		

});
