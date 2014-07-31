
var borough_scores_map = function borough_scores_map(div) {

    var map = L.map(div).setView([53.0, -1.5], 6);
    var color = function getColor(d) {
        return d > 115  ? '#1A9850':
            d > 65   ? '#91CF60' :
            d > 15   ? '#D9EF8B' :
            d > -35  ? '#FEE08B' :
            d > -85  ? '#D73027' :
            d > -135 ? '#C62016' :
            '#BABABA';
    };
    var style = function style(feature) {
        return {
            fillColor: color(feature.properties.overall_rank),
            weight: 1,
            opacity: 0,
            dashArray: '3',
            fillOpacity: 0.8
        };
    };
    var defaultStyle = function defaultstyle(feature) {
        return {
            outlineColor: "#000000",
            outlineWidth: 0.5,
            color : 'white',
            weight: 1,
            opacity: 1,
            fillOpacity: 0
        };
    };
    var pointToLayer = function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff0000",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    };
    var onEachFeature = function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature,
            pointToLayer: pointToLayer
        });
    };

    var format_number = function format_number(rank) {
        if (rank == 'NA') {
            return 'NA';
        }
        return numeral(rank).format('0,0.00');
    };

    L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery.'
        }).addTo(map);

    featureLayer(map, "data/borough_boundaries_topo.json", defaultStyle, "boundaries.geo");

    mergedFeatureLayer(map, "data/borough_scores.csv", "data/borough_boundaries_topo.json", "LA_code", style, onEachFeature, pointToLayer, "boundaries.geo");

    addLegend([-134, -84, -34, 16, 66, 116, 166], map, color);

    addInfo(map, function (props) {
        var infoBox = '<div class="span3"><h4>' + props.LA_name + '</h4>' +
                '<table class="table table-condensed">' +
                '<tr class="active"><th>Overall Rank</th><td><strong>' + format_number(props.overall_rank) + '</strong></td></tr>' +
                '<tr><th>Cycling Rank</th><td>' + format_number(props.cycling_rank) + '</td></tr>' +
                '<tr><th>Walking Rank</th><td>' + format_number(props.walking_rank) + '</td></tr>' +
                '<tr><th>Greenspace Rank</th><td>' + format_number(props.greenspace_rank) + '</td></tr>' +
                '<tr><th>Hospital Rank</th><td>' + format_number(props.hospital_rank) + '</td></tr>' +
                '<tr><th>Dentists Rank</th><td>' + format_number(props.dentists_rank) + '</td></tr>' +
                '</table>' +
                '<table class="table table-condensed">' +
                '<tr><th>Cycling Weekly</th><td>' + format_number(props.cycling_weekly) + '</td></tr>' +
                '<tr><th>Walking Thriceweekly</th><td>' + props.walking_thriceweekly + '</td></tr>' +
                '<tr><th>Weekly Greenspace Visits</th><td>' + format_number(props.weekly_greenspace_visits) + '</td></tr>' +
                '<tr><th>Hospital Experience Score</th><td>' + props.hospital_experience_score + '</td></tr>' +
                '<tr><th>Can See GP</th><td>' + numeral(100*props.pct_canseegp).format('0,') + '%</td></tr>' +
                '<tr><th>Dentists per 1000</th><td>' + format_number(props.dentists_per_thousand) + '</td></tr>' +
                '</table>' +
                '<i>' + props.LA_code + '</i></div>';

        return infoBox;
    });

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666666',
            dashArray: '',
            fillOpacity: 0.6
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        e.target._map.info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        var layer = e.target;
        layer.setStyle(style(e.target.feature));
        e.target._map.info.update();
    }

    function zoomToFeature(e) {
        e.target._map.fitBounds(e.target.getBounds());
    }
};
