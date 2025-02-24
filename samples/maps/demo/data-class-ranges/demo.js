function drawChart(data) {
    return Highcharts.mapChart('container', {
        chart: {
            map: 'custom/world',
            borderWidth: 1
        },

        colors: ['rgba(19,64,117,0.05)', 'rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
            'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'],

        title: {
            text: 'Population density by country (/km²)'
        },

        mapNavigation: {
            enabled: true
        },

        legend: {
            title: {
                text: 'Individuals per km²',
                style: {
                    color: ( // theme
                        Highcharts.defaultOptions &&
                        Highcharts.defaultOptions.legend &&
                        Highcharts.defaultOptions.legend.title &&
                        Highcharts.defaultOptions.legend.title.style &&
                        Highcharts.defaultOptions.legend.title.style.color
                    ) || 'black'
                }
            },
            align: 'left',
            verticalAlign: 'bottom',
            floating: true,
            layout: 'vertical',
            valueDecimals: 0,
            backgroundColor: ( // theme
                Highcharts.defaultOptions &&
                Highcharts.defaultOptions.legend &&
                Highcharts.defaultOptions.legend.backgroundColor
            ) || 'rgba(255, 255, 255, 0.85)',
            symbolRadius: 0,
            symbolHeight: 14
        },

        colorAxis: {
            dataClasses: [{
                to: 3
            }, {
                from: 3,
                to: 10
            }, {
                from: 10,
                to: 30
            }, {
                from: 30,
                to: 100
            }, {
                from: 100,
                to: 300
            }, {
                from: 300,
                to: 1000
            }, {
                from: 1000
            }]
        },

        series: [{
            data: data,
            joinBy: ['iso-a2', 'code'],
            animation: true,
            name: 'Population density',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km²'
            },
            shadow: false
        }]
    });
}

// Load the data from a Google Spreadsheet
// https://docs.google.com/spreadsheets/d/1WBx3mRqiomXk_ks1a5sEAtJGvYukguhAkcCuRDrY1L0/pubhtml
Highcharts.data({
    googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
    googleSpreadsheetKey: '1gXzu9TYT3UvDMcoxj_kS7PUXMmC1MNVSfewccOs2dkA',

    // Custom handler when the spreadsheet is parsed
    parsed: function (columns) {

        // Read the columns into the data array
        const data = columns[0].slice(1).map((code, i) => ({
            code: code.toUpperCase(),
            value: parseFloat(columns[2][i + 1]),
            name: columns[1][i + 1]
        }));

        drawChart(data);
    },
    error: function () {
        const chart = drawChart();
        chart.showLoading(
            '<i class="icon-frown icon-large"></i> ' +
            'Error loading data from Google Spreadsheets'
        );
    }
});
