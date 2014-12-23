function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

var modalHTML = hereDoc(function() {/*!  
 <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="myModalLabel">Parametros</h4>
      </div>
      <div class="modal-body">
        

<div class="row">

	<div class="col-md-5">
        	<label> Tipo:
					<select id="tipo_simulacion" class="form-control">
					<option value="horizontal"> Horizontal</option>
					<option value="vertical"> Vertical</option>
					</select>
				</label>
    </div>
	<div class="col-md-5">
        Tapa del tanque:
		<label><input type="radio"  name="tapa_del_tanque" checked="checked" value="img/tanque.png">Si</label>
		<label><input type="radio"  name="tapa_del_tanque" value="img/tanque_abierto.png">No</label>
    </div>
	
	    <div class="col-md-5">
        <label for="demo1">Densidad del fluido:</label> 
		<input id="demo1" type="text" value="55" name="demo_vertical2">
    </div>
	
	    <div class="col-md-5">
        <label for="demo1">Aceleración de la gravedad:</label> 
		<input id="demo1" type="text" value="55" name="demo_vertical2">
    </div>
	
	  <div class="col-md-5">
        <label for="demo1">Presión manométrica en la parte superior:</label> 
		<input id="demo1" type="text" value="55" name="demo_vertical2">
    </div>
	
	  <div class="col-md-5">
        <label for="demo1">Altura del tanque:</label> 
		<input id="demo1" type="text" value="55" name="demo_vertical2">
    </div>
	
	  <div class="col-md-5">
        <label for="demo1">Altura del orificio sobre la pared lateral:</label> 
		<input id="demo1" type="text" value="55" name="demo_vertical2">
    </div>
	
	    <div class="col-md-5">
        <label for="demo1">Nivel inicial del fluido:</label> 
		<input id="demo1" type="text" value="55" name="demo_vertical2">
    </div>
	    <div class="col-md-5">
        <label for="demo1"> Radio del orificio:</label> 
		<input id="demo1" type="text" value="55" name="demo_vertical2">
    </div>
	    <div class="col-md-5">
        <label for="demo1"> Radio del tanque:</label> 
		<input id="demo1" type="text" value="55" name="demo_vertical2">
    </div>
	
</div>
				
			
		
		
		
		
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
*/});

  $("body").append(modalHTML);