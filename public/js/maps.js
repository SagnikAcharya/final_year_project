var map, Marker1;
    function initMap1() {
      map = new mappls.Map('map', {
        center: [22.57, 88.47],
        zoomControl: true,
        location: true
      });
      map.addListener('drag', function (e) {
        let divId = document.getElementById("show-result")
        divId.style.display = "block";
        divId.innerHTML = `Map Event Type :   ${e.type}`;
      });
      Marker1 = new mappls.Marker({
        map: map,
        position: {
          "lat": 22.578208357945332,
          "lng": 88.47576574079098
        },
        fitbounds: true,
        icon_url: 'https://apis.mapmyindia.com/map_v3/1.png'
      });

    }