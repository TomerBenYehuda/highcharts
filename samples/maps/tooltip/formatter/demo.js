Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Tooltip formatter demo'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>Series name: ' + this.series.name + '</b><br>' +
                    'Point name: ' + this.point.name + '<br>' +
                    'Value: ' + this.point.value;
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });
});