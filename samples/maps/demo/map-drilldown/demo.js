let data = Highcharts.geojson(Highcharts.maps['countries/us/us-all']);
const separators = Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'mapline');

// Set drilldown pointers
data.forEach((d, i) => {
    d.drilldown = d.properties['hc-key'];
    d.value = i; // Non-random bogus data
});

function getScript(url, cb) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = cb;
    document.head.appendChild(script);
}

// Instantiate the map
Highcharts.mapChart('container', {
    chart: {
        events: {
            drilldown: function (e) {
                if (!e.seriesOptions) {
                    const chart = this,
                        mapKey = 'countries/us/' + e.point.drilldown + '-all';

                    // Handle error, the timeout is cleared on success
                    let fail = setTimeout(() => {
                        if (!Highcharts.maps[mapKey]) {
                            chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);
                            fail = setTimeout(() => {
                                chart.hideLoading();
                            }, 1000);
                        }
                    }, 3000);

                    // Show the spinner
                    chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

                    // Load the drilldown map
                    getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', () => {
                        data = Highcharts.geojson(Highcharts.maps[mapKey]);

                        // Set a non-random bogus value
                        data.forEach((d, i) => {
                            d.value = i;
                        });

                        // Hide loading and add series
                        chart.hideLoading();
                        clearTimeout(fail);
                        chart.addSeriesAsDrilldown(e.point, {
                            name: e.point.name,
                            data: data,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        });
                    });
                }
            }
        }
    },

    title: {
        text: 'Highcharts Map Drilldown'
    },

    colorAxis: {
        min: 0,
        minColor: '#E6E7E8',
        maxColor: '#005645'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    plotOptions: {
        map: {
            states: {
                hover: {
                    color: '#EEDD66'
                }
            }
        }
    },

    series: [{
        data: data,
        name: 'USA',
        dataLabels: {
            enabled: true,
            format: '{point.properties.postal-code}'
        }
    }, {
        type: 'mapline',
        data: separators,
        color: 'silver',
        enableMouseTracking: false,
        animation: {
            duration: 500
        }
    }],

    drilldown: {
        activeDataLabelStyle: {
            color: '#FFFFFF',
            textDecoration: 'none',
            textOutline: '1px #000000'
        },
        drillUpButton: {
            relativeTo: 'spacingBox',
            position: {
                x: 0,
                y: 60
            }
        }
    }
});
