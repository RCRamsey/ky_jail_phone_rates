var map = L.map('map', {
    zoomSnap: .1,
    //center: [-84.2700, 37.8393],
    // zoom: 7,
    minZoom: 7,
    maxZoom: 10,
    // maxBounds: L.latLngBounds([36.16, -89.45], [39.06, -81.62])
});

var accessToken = 'pk.eyJ1IjoicmNyYW1zZXkiLCJhIjoiY2tpN3UxOTJwMnh2ejJycXFja3NxemRocyJ9.cbhIjbrLpEGG0HkQS3fGLA'

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
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

const layer1 = $.getJSON('data/ky-counties.geojson', function (data) {

    const kyCounties = L.geoJson(data, {
    
     "color": "#000",
     "opacity": 0.08, 

    }).addTo(map)

    console.log(kyCounties)
    map.fitBounds(kyCounties.getBounds())

})

$.when(layer1)
    .then(function () {
        omnivore.csv('data/rates_ky_jail_by_cnty.csv')
            .on('ready', function (e) {

                //access to GeoJSON here
                //.toGeoJSON method, added to e.target object, to load csv as GeoJSON
                //bonus loading as csv instead of GeoJSON initially reduces file size

                console.log(e.target.toGeoJSON())

                drawMap(e.target.toGeoJSON());
                // reColorCircles(e.target.toGeoJSON());
                // drawLegend(e.target.toGeoJSON());
            })

            .on('error', function (e) {
                console.log(e.error[0].message)
            });
    })

//send argument 'e.target.toGeoJSON()' and drawMap accept as parameter 'data'
function drawMap(data) {
    //access to data here

    data.features.forEach(function (feature) {
        const props = feature.properties
        if (props['fifteen minute'] != null) {
            lz['fifteen minute'].values.push(+props['fifteen minute']) //push values into empty values array above
        }
    })

    //calculate average of values pushed into the array using:
    //.reduce reduces the array to a single value based on a provided a function occurring for each value (left-right) in the array. Then returns the value of function stored. This does not change the original array.
    //sum of array and values of array returned
    //.length calculates how many numbers in the original array
    //Returned sum from .reduce function is then divided by how many numbers are in the array. to caluclate average of array 

    //fifteen minute data used as it incorporates both the initial 1st min phone call and additional minute cost. 
    lz['fifteen minute'].average =
        lz['fifteen minute'].values.reduce(function (sum, value) {
            return sum + value; //is this just returning the sum AND the original values for later use?
        }, 0) / lz['fifteen minute'].values.length;

    console.log(lz['fifteen minute'].average)


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
                color: lz['fifteen minute'].color,
                fillColor: lz['fifteen minute'].color,
                radius: getRadius(feature.properties['fifteen minute'])
            }

        },
        //add user interaction for clicking 
        onEachFeature: function (feature, layer) {

            layer.on('mouseover', function (e) {
                e.target.setStyle({
                    fillColor: 'white'
                });
                layer.on('mouseout', function (e) {


                    e.target.setStyle({
                        // fillColor: lz['fifteen minute'].color
                        fillColor: colorCircles(layer.feature.properties['fifteen minute'], lz['fifteen minute'].average)
                    });
                })
            });

            //calculate how the property compares to average amount of sum of property values and round
            var props = feature.properties

            for (i in lz) {
                if (lz[i].average) {
                    lz[i].compare = Math.round((props[i] / lz[i].average) * 100)
                }
            }

            // console.log(props.Facility);

            //create popup with Name of layer & cost referencing geoJSON
            var popup = `<b>Name:</b> ${props.Facility}<br>
                            <b>Provider:</b> ${props.Provider}<br>
                            <b>15 minute call cost:</b> $${props['fifteen minute']}, ${lz['fifteen minute'].compare}% of average facility call cost`

            layer.bindTooltip(popup)

        }

    }).addTo(map);
  
    reColorCircles(cost)
} // end drawMap()


// altered csv to remove $ and used: 
function getRadius(area) {
    var radius = Math.sqrt(area / Math.PI);
    return radius * 15;
}

//create legend using leaflet control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h7>+1.5x State Average</h7>' + '<h8><br>1-1.5x State Average</h8>' + '<h9><br>0.5-1x State Average</h9>' + '<h10><br> <0.5x State Average</h10>';
};

info.addTo(map);


// Function to assign circle colors based on the individual leaflet layer's (one layer per circle) value in relationship to the average value for the state.  
function reColorCircles(data) {

    // iterate through each leaflet circle layer
    data.eachLayer(function(layer){
        const p = layer.feature.properties
        console.log(p['fifteen minute'])

        //color circle based on value in relationship to avg value for entire data set
        layer.setStyle({
            fillColor: colorCircles(p['fifteen minute'], lz['fifteen minute'].average)
        });
    })

}

//color function
function colorCircles (x, avg) {
    if (x>= 1.5 * avg) {
        return 'red'
    } else if (x>= avg ) {
        return '#d16706'
    } else if (x>= 0.5* avg) {
        return 'gray'
    } else {
        return 'blue'
    }
}    