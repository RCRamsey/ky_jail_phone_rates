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
            lz['first minute'].values.push(+props['first minute'])
        }
    })

  lz['first minute'].average = lz['first minute'].values.reduce(function (sum, value) {
        return sum + value;
    }, 0) / lz['first minute'].values.length;

console.log(lz['first minute'].average)




    /////////////////////////////////////////////////////////////////////////////////////////////
    //dynamically create variable names for each geoJson layer and store as property names with geoJsonLayers object to access those layers and add to the map.
    // Define the desired layers and their colors to place
    // as JS object
   
    // // Build empty JS object
    // var geoJsonLayers = {};

    var commonStyles = {
        weight: 1,
        stroke: 1,
        opacity: 1
    };

    // Loop through first object
    //assign a var layer for each within layerInfo of objects by looping
    // for (var layer in layerInfo) {

        // 🌩 Use layerInfo as a lookup for property names and desired symbology and create the layers with the below method.
        const cost = L.geoJson(data, {

            pointToLayer: function (feature, latlng) {
                // console.log(latlng)
                return L.circleMarker(latlng, commonStyles);
            },
            // // exist in our first object
            // filter: function (feature) {
    
            //     if (feature.properties[layerInfo[layer].source]) {
            //         console.log(feature)
            //         return feature;
            //     }
            // },
            // and match the style given in first object and with getRadius()
            style: function (feature) {
                // const x = feature.properties[layerInfo[layer].source]
                // console.log(feature)
                // // 🌩 how to replace or remove the $ character to make a number
                return {
                    color: lz['first minute'].color,
                    fillColor: lz['first minute'].color,
                //     radius: getRadius(x)

                //radius was not populating any differently using the x var. I removed the $ from the csv and used:
                    radius: getRadius(feature.properties['first minute'])
                //or could remove $ on front end of data and use:
                }

            },
            //add user interaction for clicking 
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function (e) {
                    e.target.setStyle({
                        fillColor: 'white'
                    });
                    layer.on('mouseout', function(e){
                        //🐔original style for layer is now found where? need to ref here in order to reset style after mouse out.
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
                        lz[i].compare = (props[i] / lz[i].average) * 100
                    }
                }

               // console.log(props.Facility);
               //🐔 cost will vary based on layer used, need loop to decide if only single layer on?
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


    

    //radius was not differing between the circles based on the value being pulled from the layer. All were drawing the same radius no matter the value
    // function getRadius(val) {
    //     var radius = Math.sqrt(val / Math.PI);
    //     return radius * 10;
    // }

    // altered csv to remove $ and used: 
    function getRadius(area) {
        var radius = Math.sqrt(area/Math.PI);
        return radius * 20;
    }

    //leaflet layer control with label text styled
    // var sourcesLabels = {
    //     "<b style ='color:#000000'>1st Minute</b>": geoJsonLayers.minuteLayer,
    //     "<b style ='color:#9c7b66'>Additional Minute</b>": geoJsonLayers.addMinuteLayer,
    //     "<b style ='color:#d16706'>Fifteen Minute</b>": geoJsonLayers.fifteenMinuteLayer
    // }

    // L.control.layers(null, sourcesLabels, {
    //     collapsed: false
    // }).addTo(map);



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


//  // 🐔 loop through all features (do I need to create the layerInfo to loop through again?)
//  data.features.forEach(function (time) {

//      // for each time in a facility
//      for (let time in = features.properties) {

//          // shorthand to each value
//          const value = features.properties["fifteen minute"];

//          // if the value can be converted to a number 
//          // the + operator in front of a number returns a number
//          if (+value) {

//              //return the value to the array
//              dataValues.push(+value);
//          }

//      }
//  });
//  // verify your results!
//  console.log(dataValues);

//   // sort array
//   const sortedValues = dataValues.sort(function (a, b) {
//       return b - a;
//   });

//   // round highest number, use as large circle diameter
//   const maxValue = Math.round(sortedValues[0] / 1000) * 1000;

//   // calc diameters
//   const largeDiameter = calcRadius(maxValue) * 2,
//       smallDiameter = largeDiameter / 2;

//   // select circles container and set height
//   $(".legend-circles").css('height', largeDiameter.toFixed());

//   // set width and height for large circle (rounded whole number)
//   $('.legend-large').css({
//       'width': largeDiameter.toFixed(),
//       'height': largeDiameter.toFixed()
//   });
//   // set width and height for small circle and position
//   $('.legend-small').css({
//       'width': smallDiameter.toFixed(),
//       'height': smallDiameter.toFixed(),
//       'top': largeDiameter - smallDiameter,
//       'left': smallDiameter / 2
//   })

//   // label max and median value
//   $(".legend-large-label").html(maxValue.toLocaleString());
//   $(".legend-small-label").html((maxValue / 2).toLocaleString());

//   // adjust position of large based on size of circle
//   $(".legend-large-label").css({
//       'top': -11,
//       'left': largeDiameter + 30,
//   });

//   // adjust the position of small based on size of circle
//   $(".legend-small-label").css({
//       'top': smallDiameter - 11,
//       'left': largeDiameter + 30
//   });

//   // insert hr elements and use to connect value label to top of each circle
//   $("<hr class='large'>").insertBefore(".legend-large-label")
//   $("<hr class='small'>").insertBefore(".legend-small-label").css('top', largeDiameter - smallDiameter - 8);
    
// }