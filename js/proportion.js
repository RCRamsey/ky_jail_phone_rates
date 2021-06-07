
    var map = L.map('map', {
        zoomSnap: .1,
        //center: [-84.2700, 37.8393],
        // zoom: 7,
        minZoom: 7,
        maxZoom: 10,
        maxBounds: L.latLngBounds([36.16, -89.45], [39.06, -81.62])
    });

    var accessToken = 'pk.eyJ1IjoicmNyYW1zZXkiLCJhIjoiY2tpN3UxOTJwMnh2ejJycXFja3NxemRocyJ9.cbhIjbrLpEGG0HkQS3fGLA'

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'light-v10',
        accessToken: accessToken
    }).addTo(map);


    omnivore.csv('data/rates_ky_jail_prison_by_county.csv')
        .on('ready', function (e) {

            //access to GeoJSON here
            //.toGeoJSON method, added to e.target object, to load csv as GeoJSON
            //bonus loading as csv instead of GeoJSON initially reduces file size

            console.log(e.target.toGeoJSON())

            drawMap(e.target.toGeoJSON());
        })

        .on('error', function (e) {
            console.log(e.error[0].message)
        });
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //send argument 'e.target.toGeoJSON()' and drawMap accept as parameter 'data'
    function drawMap(data) {
        //access to data here
        console.log(data);
        const options = {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    opacity: 1,
                    weight: 2,
                    fillOpacity: 0,
                })
            }
        }
        // create 3 separate layers from GeoJSON data
        const minuteLayer = L.geoJson(data, options).addTo(map),
            addMinuteLayer = L.geoJson(data, options).addTo(map);
        fifteenMinuteLayer = L.geoJson(data, options).addTo(map);

        // confirm 3 separate geoJSON layers created using omnivore to load csv
        console.log(minuteLayer);
        console.log(addMinuteLayer);
        console.log(fifteenMinuteLayer);

        // // set style of individual layers when representing without proportion or dynamically
        // minuteLayer.setStyle({
        //     color: '#000000',
        //     radius: 5,
        // });
        // addMinuteLayer.setStyle({
        //     color: '#9c7b66',
        //     radius: 6,
        // });
        // fifteenMinuteLayer.setStyle({
        //     color: '#d16706',
        //     radius: 7,
        // });

        // fit the bounds of the map to one of the layers
        map.fitBounds(minuteLayer.getBounds());

        // adjust zoom level of map
        map.setZoom(map.getZoom() - .4);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //dynamically create variable names for each geoJson layer and store as property names with geoJsonLayers object to access those layers and add to the map.
        // Define the desired layers and their colors to place
        // as JS object
        var layerInfo = {
            minuteLayer: {
                source: "1st Minute",
                color: '#000000'
            },
            addMinuteLayer: {
                source: "Additional Minute",
                color: '#9c7b66'
            },
            fifteenMinuteLayer: {
                source:"Fifteen Minute Call",
                color: '#d16706'
            }
        };

        // Build empty JS object
        var geoJsonLayers = {};

        var commonStyles = {
            weight: 1,
            stroke: 1,
            opacity: .8
        };

        // Loop through first object
        for (var layer in layerInfo) {
            // Populate the second object with all features that
            //🔥previously in 672 module 8 we used power-plants.js to store all of our data as and object and added var plants = that entire js file. Aren't the geoJson layers I created on lines 50-53 now stored as a JS object on line 83? Therefore in theory this should loop through and not produce an error...
            geoJsonLayers[layer] = L.geoJson(layerInfo, {
                // we convert to a layer
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, commonStyles);
                },
                // exist in our first object
                filter: function (feature) {
                    if (feature.properties[layerInfo[layer].source]) {
                        return feature;
                    }
                },
                // and match the style given in first object and with getRadius()
                style: function (feature) {
                    return {
                        color: layerInfo[layer].color,
                        fillColor: layerInfo[layer].color,
                        radius: getRadius(feature.properties.first_minute[layerInfo[layer].source])
                    }
                }
            }).addTo(map);
        }

        function getRadius(val) {
            var radius = Math.sqrt(val / Math.PI);
            return radius * .8;
        }

        var sourcesLabels = {
            "1st Minute": geoJsonLayers.minuteLayer,
            "Additional Minute": geoJsonLayers.addMinuteLayer,
            "Fifteen Minute":geoJsonLayers.fifteenMinuteLayer
        }

        L.control.layers(null, sourcesLabels, {
            collapsed: false
        }).addTo(map);
    }