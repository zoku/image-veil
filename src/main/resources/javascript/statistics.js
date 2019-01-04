(function () {
    if ($('#m-statistics').length === 0) { return; }

    new Chart('m-statistics', {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Uses',
                data: numbers
            }]
        },
        options: {
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