var map,marker;
        /*Map Initialization*/
        function initMap1(){
            map = new mappls.Map('map', {
                center: [22.57, 88.36],
                zoom: 10
            });
            map.addListener('load',function(){
                var optional_config = {
                    geolocation:false,
                    region: "IND",
                    height:300,
                };
                new mappls.search(document.getElementById("auto"), optional_config, callback);
                function callback(data) {
                    if (data) {
                        var dt = data[0];
                        if (!dt) return false;
                        var eloc = dt.eLoc;
                        var place = dt.placeName + ", " + dt.placeAddress;
                        /*Use elocMarker Plugin to add marker*/
                        if (marker) marker.remove();
                        mappls.pinMarker({
                            map: map,
                            pin: eloc,
                            popupHtml: place,
                            popupOptions: {
                                openPopup: true
                            }
                        }, function(data){
                            marker=data;
                            marker.fitbounds();
                        })
                    }
                }
            });
        }