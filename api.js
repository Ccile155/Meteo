$(function(){

var donnees = {};
var donneesParis = {};

//================================================== RECUP DEFAULT ==================================================

	function appelApiParis(){
			$.get("http://api.openweathermap.org/data/2.5/weather?q=paris,fr&APPID=6903be97ffc6fc71dd684deb83487d44&units=Metric", callbackgetSuccess2)

			.done(function(){
				//alert("Olé, ca marche!");
				})
			.fail(function(){
				alert("Oups, fail.");
				})
			.always(function(){
				//alert("End of the road, baby");
				})
			};

	var callbackgetSuccess2 = function(data){
		donneesParis = data;
		mapCreate(donneesParis, 0);
		return donneesParis;
	};

appelApiParis();

//================================================== MAP ==================================================
 var marker;
 var mymap;

 function mapCreate(paris, ville){

	if(ville == 0){
		mymap = L.map('map').setView([paris.coord.lat, paris.coord.lon], 5);

		L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',{
		    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		    maxZoom: 18,
		    id: 'mapbox.streets',
		    accessToken: 'your.mapbox.access.token'
		}).addTo(mymap);

			// var marker = L.marker([48.8575, 2.348]).addTo(map);
		marker = L.marker([paris.coord.lat, paris.coord.lon], {draggable:'true'}).addTo(mymap);
		marker.bindPopup("<b>"+paris.name+"</b><br>Température: "+paris.main.temp+"°C.").openPopup();
	
	} else{
		marker.setLatLng({lat: ville.coord.lat, lng: ville.coord.lon});
		marker.bindPopup("<b>"+ville.name+"</b><br>Température: "+ville.main.temp+"°C.").openPopup();
	}

	var popup = L.popup();
	function onMapClick(e) {
	    popup
	        .setLatLng(e.latlng)
	        .setContent("You clicked the map at " + e.latlng.toString())
	        .openOn(mymap);
		marker.setLatLng(e.latlng);

	}
	mymap.on('click', onMapClick);

	function relachement(e) {
	    marker.getPopup().setContent(''+marker.getLatLng());
	    marker.openPopup();
	}
	marker.on('dragend', relachement);	

};

//================================================== RECUP VILLE ==================================================
	$('input').keypress(function () {
	 var key = event.keyCode;
		 if(key == 13 ) { // the enter key code
			$("#bouton").click();
		}
	});

		$("#bouton").on("click", function appelApi(){
			let ville = $("#ville").val();
			let codePays= $("#codePays").val();
			$.get("http://api.openweathermap.org/data/2.5/weather?q="+ville+","+codePays+"&APPID=6903be97ffc6fc71dd684deb83487d44&units=Metric", callbackgetSuccess)

			.done(function(){
				// alert("Olé, ca marche!");
				})
			.fail(function(){
				alert("Oups, fail.");
				})
			.always(function(){
				// alert("End of the road, baby");
				})
		});

	var callbackgetSuccess = function(data){
		
		$("#retour_api").empty();
		$("#retour_api").append("La température est de :" + data.main.temp +"°C à " + data.name+".<br/>");
			if (data.clouds.all <= 25){
				$("#retour_api").append(data.clouds.all +"% de nuages: le ciel est clair :)<br/>");
			}
			else if (data.clouds.all <= 50 && data.clouds.all > 25){
				$("#retour_api").append(data.clouds.all +"% de nuages: Quelques nuages contrastent avec le bleu du ciel...<br/>");
			}
			else if (data.clouds.all <= 75 && data.clouds.all > 50){
				$("#retour_api").append(data.clouds.all +"% de nuages: Couvert.<br/>");
			}
			else if (data.clouds.all <= 100 && data.clouds.all > 75){
				$("#retour_api").append(data.clouds.all +"% de nuages: On n'y voit plus rien!<br/>");
			};

		// $("#retour_api").append("Il est intéressant de noter que cette ville se situe aux coordonnées " +data.coord.lat+", "+data.coord.lon+".");
		

		donnees = data;
		mapCreate(donneesParis, donnees);
		return donnees;
	}

	// $("#comp").on("click", function (){
	// 	$("#comp").after("<p>A Paris il fait "+donneesParis.main.temp+"°C, alors qu'à "+donnees.name+" il fait "+ donnees.main.temp +"°C.<br/></p>");
	// })


});