(function () {
    if ($('#m-statistics').length === 0) { return; }

    new Chart('m-statistics', {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Uses',
                data: numbers,
                borderColor: '#0d656d',
                backgroundColor: 'rgba(13, 101, 109, 0.1)'
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
})();