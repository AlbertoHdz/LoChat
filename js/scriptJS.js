$(document).ready(function(){//uso de jquery para usar javascript cuando se cargue el DOM
 
  	$("#convertir").click(function() {//cuando se hace click en el boton CONVERTIR
 
  		var num = document.getElementById("numCen").value;//obteniendo el valor del campo a convertir
 
  		if(num=="" || num==null){//validacion si la casilla esta vacia
  			document.getElementById("numCen").style.background='#FFBCD4'; //si esta vacia se sombrea con un color tenuea primera advertencia
  		}
  		else{//si no esta vacia la casilla sigue a la siguiente validacion
  			if(!isNaN(num)){//se valida si es un numero
  				var div = document.getElementById("capRes"); //se almacena en una variable la capa que esta oculta y muestra el resultado
 
  				document.getElementById("numCen").style.background='#fff';//se quita el color de los errores de las validaciones  				
 
  				var far = parseInt(num)*9/5+32;//se hace la conversion para la temperatura F°
  				var kel = parseInt(num) +273.15;//se hace la conversion para la temperatura K°
 
  				document.getElementById("grF").value= far; //se muestra el resultado F°
  				document.getElementById("grK").value = kel;//se muestra el resultado K°
  				document.getElementById("btnRes").style.visibility  = "visible"; //se hace visible el boton reiniciar
  				div.style.visibility= "visible"; 	//se hace visible la capa que muestra los resultados
 
 
 
  			}else{//si no es un numero se sombrea con un color mas fuerte segunda advertencia
  				document.getElementById("numCen").style.background='#FF6E97';//si no es un numero el que se ingresa se sombre con un color mas fuerte, segunda advertencia
  			}
 
  		}
 
	});
 
	$('#btnRes').click(function() {//cuando se hace click en el boton de reiniciar
 
		var div = document.getElementById("capRes"); //se almacena en una variable la capa que muestra el resultado
		document.getElementById("btnRes").style.visibility  = "hidden";//se oculta el boton de reiniicar
		document.getElementById("grF").value= "";//se elimina el valor en el campo de la temperatura F°
  		document.getElementById("grK").value = "";//se elimina el valor en el campo de la temperatura K°
  		document.getElementById("numCen").value ="";//se elimina el valor en el campo del numero a convertir
 
 
		div.style.visibility="hidden";//se oculta la capa que muestra los resultados
 
		});
 
});