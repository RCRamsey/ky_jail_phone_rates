(function () {

    var map = L.map('map', {
        zoomSnap: .1,
        //center: [-84.2700, 37.8393],
        // zoom: 7,
        minZoom: 7,
        maxZoom: 10,
        maxBounds: L.latLngBounds([36.16, -89.45], [39.06 , -81.62 ])
    });

    var accessToken = 'pk.eyJ1IjoicmNyYW1zZXkiLCJhIjoiY2tpN3UxOTJwMnh2ejJycXFja3NxemRocyJ9.cbhIjbrLpEGG0HkQS3fGLA'

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'light-v10',
        accessToken: accessToken
    }).addTo(map);


    omnivore.csv('data/ky_jail_prison_by_county.csv')
        .on('ready', function (e) {

            //access to GeoJSON here
            //.toGeoJSON method, added to e.target object, to load csv as GeoJSON
            //bonus loading as csv instead of GeoJSON initially reduces file size

            console.log(e.target.toGeoJSON())

            drawMap(e.target.toGeoJSON());
            drawLegend(e.target.toGeoJSON());
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
            fifteenMinuteLayer = L.geoJson(data,options).addTo(map);

        minuteLayer.setStyle({
            color: '#000000',
        });
        addMinuteLayer.setStyle({
            color: '#9c7b66',
        });
        // fifteenMinuteLayer.setStyle({
        //     color: '#d16706',
        // })

        // fit the bounds of the map to one of the layers
        map.fitBounds(minuteLayer.getBounds());

        // adjust zoom level of map
        map.setZoom(map.getZoom() - .4);

        //💭set/update size of circles, what does the 1 stand for again currentGrade to start with?
        resizeCircles(minuteLayer, addMinuteLayer, fifteenMinuteLayer);

        //create UI slider
        // sequenceUI(minuteLayer, addMinuteLayer, fifteenMinuteLayer);
    } //end drawMap()

////////////////////////////////////////////////////////////////////////////////////
    //draw legend
    function drawLegend(data) {
        //create leaflet control for the legend
        const legendControl = L.control({
            position: 'bottomright'
        });

        //when control addded to map
        legendControl.onAdd = function (map) {
            const legend = L.DomUtil.get('legend');

            //disable scroll/click functionality
            L.DomEvent.disableScrollPropagation(legend);
            L.DomEvent.disableClickPropagation(legend);

            //return selection
            return legend;
        }
        legendControl.addTo(map);
        // empty array to hold values
        const dataValues = [];

        // loop through all features (i.e., the schools)
        data.features.forEach(function (facility) {

            // for each time 1st minute, additional minute, 15 minute per jail
            for (let time in facility.properties) {

                // shorthand to each value
                const value = facility.properties[grade];

                // if the value can be converted to a number 
                // the + operator in front of a number returns a number
                if (+value) {

                    //return the value to the array
                    dataValues.push(+value);
                }

            }
        });
        // verify your results!
        console.log(dataValues);

        // sort our array
        const sortedValues = dataValues.sort(function (a, b) {
            return b - a;
        });

        // round the highest number and use as our large circle diameter
        const maxValue = Math.round(sortedValues[0] / 1000) * 1000;

        // calc the diameters
        const largeDiameter = calcRadius(maxValue) * 2,
            smallDiameter = largeDiameter / 2;

        // select our circles container and set the height
        $(".legend-circles").css('height', largeDiameter.toFixed());

        // set width and height for large circle (rounded whole number)
        $('.legend-large').css({
            'width': largeDiameter.toFixed(),
            'height': largeDiameter.toFixed()
        });
        // set width and height for small circle and position
        $('.legend-small').css({
            'width': smallDiameter.toFixed(),
            'height': smallDiameter.toFixed(),
            'top': largeDiameter - smallDiameter,
            'left': smallDiameter / 2
        })

        // label the max and median value
        $(".legend-large-label").html(maxValue.toLocaleString());
        $(".legend-small-label").html((maxValue / 2).toLocaleString());

        // adjust the position of the large based on size of circle
        $(".legend-large-label").css({
            'top': -11,
            'left': largeDiameter + 30,
        });

        // adjust the position of the large based on size of circle
        $(".legend-small-label").css({
            'top': smallDiameter - 11,
            'left': largeDiameter + 30
        });

        // insert a couple hr elements and use to connect value label to top of each circle
        $("<hr class='large'>").insertBefore(".legend-large-label")
        $("<hr class='small'>").insertBefore(".legend-small-label").css('top', largeDiameter - smallDiameter - 8);
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////
    function resizeCircles(minuteLayer, addMinuteLayer, fifteenMinuteLayer, currentMinute) {
        Layer.eachLayer(function (layer) {
            const radius = calcRadius(Number(layer.feature.properties[currentMinute]));
            layer.setRadius(radius);
        });
        addMinuteLayer.eachLayer(function (layer) {
            const radius = calcRadius(Number(layer.feature.properties[currentMinute]));
            layer.setRadius(radius);
        });
        retrieveInfo(minuteLayer, addMinuteLayer, fifteenMinuteLayer, 1);
    }
//////////////////////////////////////////////////////////////////////////////////////////////
    function calcRadius(val) {
        const radius = Math.sqrt(val / Math.PI);
        return radius * .5; // adjust .5 as a scale factor
    }
/////////////////////////////////////////////////////////////////////////////////////////
    function sequenceUI(minuteLayer, addMinuteLayer, fifteenMinuteLayer) {
        // sequenceUI function body
        const sliderControl = L.control({
            position: 'bottomleft'
        });
        sliderControl.onAdd = function (map) {
            const controls = L.DomUtil.get("slider");
            L.DomEvent.disableScrollPropagation(controls);
            L.DomEvent.disableClickPropagation(controls);
            return controls;
        }
        sliderControl.addTo(map);

        //dynamic slider Title
        const sliderTitle = L.control({
            position: 'bottomleft'
        });
        sliderTitle.onAdd = function (map){
            const grade = L.DomUtil.get("sliderTitle");
            L.DomEvent.disableScrollPropagation(grade);
            L.DomEvent.disableClickPropagation(grade);
            return grade;
        }
        sliderTitle.addTo(map);

        //select the slider's input and listen for change
        $('#slider input[type=range]')
            .on('input', function () {

                // current value of slider is current grade level
                var currentMinute = this.value;

                // populate HTML element with relevant info
                $('#sliderTitle').html(`<b>Grade: ${currentMinue}</b>`);

                // resize the circles with updated grade level
                resizeCircles(minuteLayer, addMinuteLayer, fifteenMinuteLayer, currentMinute);
            });

    }
/////////////////////////////////////////////////////////////////////////////////////
    // //use single layer because both use same data for grade
    // //also the boys layer is ontop of girls layer so it can detect mousover events
    // function retrieveInfo(minuteLayer, currentGrade) {
    //     // update the hover window with current grade's
    //   // select the element and reference with variable
    //   // and hide it from view initially
    //   const info = $('#info').hide();

    //   // since boysLayer is on top, use to detect mouseover events
    //   boysLayer.on('mouseover', function (e) {

    //       // remove the none class to display and show
    //       info.show();

    //       // access properties of target layer
    //       const props = e.layer.feature.properties;

    //     //   // populate HTML elements with relevant info
    //       $('#info span').html(props.COUNTY);
    //       $(".girls span:first-child").html(`(grade ${currentGrade})`);
    //       $(".boys span:first-child").html(`(grade ${currentGrade})`);
    //       $(".girls span:last-child").html(Number(props[`G${currentGrade}`]).toLocaleString());
    //       $(".boys span:last-child").html(Number(props[`B${currentGrade}`]).toLocaleString());

    //       // raise opacity level as visual affordance
    //       e.layer.setStyle({
    //           fillOpacity: .6
    //       });

    //       // empty arrays for boys and girls values
    //       const minuteValues = [],
    //           addMinuteValues = [],
    //           fifteenMinuteValues = [],

    //       // loop through the grade levels and push values into those arrays
    //       for (let i = 1; i <= 4; i++) {
    //           minuteValues.push(props['G' + i]);
    //           addMinuteValues.push(props['B' + i]);
    //           fifteenMinuteValues.push(props['C'+ i]);
    //       }
       
    //   // hide the info panel when mousing off layergroup and remove affordance opacity
    //   boysLayer.on('mouseout', function (e) {

    //       // hide the info panel
    //       info.hide();

    //       // reset the layer style
    //       e.layer.setStyle({
    //           fillOpacity: 0
    //       });
    //   });

    //   // when the mouse moves on the document
    //   $(document).mousemove(function (e) {
    //       // first offset from the mouse position of the info window
    //       info.css({
    //           "left": e.pageX + 6,
    //           "top": e.pageY - info.height() - 25
    //       });

    //       console.log(e.pageX, e.pageY)
    //       // if it crashes into the top, flip it lower right
    //       if (info.offset().top < 4) {
    //           info.css({
    //               "top": e.pageY + 15
    //           });
    //       }
    //       // if it crashes into the right, flip it to the left
    //       if (info.offset().left + info.width() >= $(document).width() - 40) {
    //           info.css({
    //               "left": e.pageX - info.width() - 80
    //           });
    //       }
    //   });
    // }
})();