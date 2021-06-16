var map = L.map('map', {
    zoomSnap: .1,
    //center: [-84.2700, 37.8393],
    // zoom: 7,
    minZoom: 7,
    maxZoom: 10,
   // maxBounds: L.latLngBounds([36.16, -89.45], [39.06, -81.62])
});

var accessToken = 'pk.eyJ1IjoicmNyYW1zZXkiLCJhIjoiY2tpN3UxOTJwMnh2ejJycXFja3NxemRocyJ9.cbhIjbrLpEGG0HkQS3fGLA'

L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'light-v10',
    accessToken: accessToken
}).addTo(map);

const lz = {
    "first minute": {
        color: '#000000',
        values: []
    },
    "additional minutes": {
        color: '#9c7b66',
        values: []
    },
    "fifteen minute": {
        color: '#d16706',
        values: []
    }
};

const layer1 = $.getJSON('data/ky-counties.geojson', function(data) {

    const kyCounties = L.geoJson(data, {

        // options

    }).addTo(map)

    map.fitBounds(kyCounties.getBounds())

})


$.when(layer1)
    .then( function () {
        omnivore.csv('data/rates_ky_jail_by_cnty.csv')
    .on('ready', function (e) {

        //access to GeoJSON here
        //.toGeoJSON method, added to e.target object, to load csv as GeoJSON
        //bonus loading as csv instead of GeoJSON initially reduces file size

        console.log(e.target.toGeoJSON())

        drawMap(e.target.toGeoJSON());
       // drawLegend(e.target.toGeoJSON());
    })

    .on('error', function (e) {
        console.log(e.error[0].message)
    });
    })




/////////////////////////////////////////////////////////////////////////////////////////////////
//send argument 'e.target.toGeoJSON()' and drawMap accept as parameter 'data'
function drawMap(data) {
    //access to data here

    data.features.forEach(function(feature) {
        const props = feature.properties
        if (props['first minute'] != null) {
            lz['first minute'].values.push(+props['first minute']) //push values into empty values array above
        }
    })

    //calculate average of values pushed into the array using:
    //.reduce reduces the array to a single value based on a provided a function occurring for each value (left-right) in the array. Then returns the value of function stored. This does not change the original array.
    //sum of array and values of array returned
    //.length calculates how many numbers in the original array
    //Returned sum from .reduce function is then divided by how many numbers are in the array. to caluclate average of array 
    //🐔 what does the ,0 do on line 92?
    
  lz['first minute'].average = 
    lz['first minute'].values.reduce(function (sum, value) {
            return sum + value; //is this just returning the sum AND the original values for later use?
        }, 0) / lz['first minute'].values.length; 

console.log(lz['first minute'].average)


    ///////////////////////////////////////////////////////////////////////////////////////
    //define common Style for proportional symbols to be displayed

    var commonStyles = {
        weight: 1,
        stroke: 1,
        opacity: 1
    };

    // create circle leaflet layer from data received as a parameter in drawMap function

        const cost = L.geoJson(data, {

            pointToLayer: function (feature, latlng) {
                // console.log(latlng)
                return L.circleMarker(latlng, commonStyles);
            },
            // and match the style given in first object and with getRadius()
            style: function (feature) {
                //console.log(feature)

                return {
                    color: lz['first minute'].color,
                    fillColor: lz['first minute'].color,
                    radius: getRadius(feature.properties['first minute'])
                }

            },
            //add user interaction for clicking 
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function (e) {
                    e.target.setStyle({
                        fillColor: 'white'
                    });
                    layer.on('mouseout', function(e){

                        // layer.setStyle(lz.color)/

                        e.target.setStyle({
                            fillColor: lz['first minute'].color
                        });
                    })
                });
                //create popup with Name of layer & cost by referencing geoJSON
                var props=feature.properties
                
                for (i in lz) {
                    if (lz[i].average) {
                        lz[i].compare = (props[i] / lz[i].average) * 100 //calculates how the property compares to the average amount of the sum of the property
                    }
                }

               // console.log(props.Facility);
               //cost will vary based on layer used
                var popup = `Name: ${props.Facility}<br>
                            Provider: ${props.Provider}<br>
                            Rate first minute:  ${props['first minute']}, ${lz['first minute'].compare}% of average`
                        //     // 1st Minute: $ ${}<br>
                        //    Additional Minute: $ ${props.additionalMinute}<br>
                        // //    Fifteen Minute: $ ${props.fifteen_minute}` 
                           layer.bindTooltip(popup)
            }
        }).addTo(map);
        //🐔 map bounds too zoomed in. Options?
        // map.fitBounds(cost.getBounds());
    } // end drawMap()


    // altered csv to remove $ and used: 
    function getRadius(area) {
        var radius = Math.sqrt(area/Math.PI);
        return radius * 20;
    }

// // drawLegend function
// function drawLegend(data){
//     console.log(data);
//     //create leaflet control for the legend
//     const legendControl=L.control ({
//         position: 'bottomright'
//     });

//     //when control added to map
//     legendControl.onAdd= function (map) {
//         const legend = L.DomUtil.get('legend');
        
//         //disable scrol/click functionaliaty
//         L.DomEvent.disableScrollPropagation(legend);
//         L.DomEvent.disableClickPropagation(legend);

//         //return selection
//         return legend;
//     };

//     legendControl.addTo(map);

