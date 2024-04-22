document.addEventListener('DOMContentLoaded', function() {
    let temperatureChart;
    let humidityChart;
    let temperatureData = [];
    let humidityData = [];

    // Function to update temperature chart data
    function updateTemperatureChart(temperature) {
        const roundedTemp = Math.round(temperature * 100) / 100;
        document.getElementById('bedroom-temp').innerText = roundedTemp + ' °C';

        // Update temperature chart data
        temperatureData.push({ x: new Date(), y: temperature });

        // Update statistical analysis and temperature chart
        updateTemperatureStatistics();
        updateTemperatureChart();
    }

    // Function to update humidity chart data
    function updateHumidityChart(humidity) {
        const roundedHum = Math.round(humidity * 100) / 100;
        document.getElementById('bedroom-humidity').innerText = roundedHum + ' %';

        // Update humidity chart data
        humidityData.push({ x: new Date(), y: humidity });

        // Update statistical analysis and humidity chart
        updateHumidityStatistics();
        updateHumidityChart();
    }

    // Function to update temperature chart
    function updateTemperatureChart() {
        temperatureChart.data.datasets[0].data = temperatureData;
        temperatureChart.update();
    }

    // Function to update humidity chart
    function updateHumidityChart() {
        humidityChart.data.datasets[0].data = humidityData;
        humidityChart.update();
    }

    // Function to update statistical analysis for temperature
    function updateTemperatureStatistics() {
        const avgTemperature = calculateAverage(temperatureData.map(data => data.y));
        document.getElementById('average-temp').innerText = isNaN(avgTemperature) ? '-- °C' : avgTemperature.toFixed(2) + ' °C';
    }

    // Function to update statistical analysis for humidity
    function updateHumidityStatistics() {
        const avgHumidity = calculateAverage(humidityData.map(data => data.y));
        document.getElementById('average-humidity').innerText = isNaN(avgHumidity) ? '-- %' : avgHumidity.toFixed(2) + ' %';
    }

    // Function to calculate average
    function calculateAverage(data) {
        if (data.length === 0) return NaN;
        const sum = data.reduce((acc, val) => acc + val, 0);
        return sum / data.length;
    }

    // Initialize the temperature chart
    const tempCtx = document.getElementById('temperature-chart').getContext('2d');
    temperatureChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature (°C)'
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'second'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }]
            }
        }
    });

    // Initialize the humidity chart
    const humCtx = document.getElementById('humidity-chart').getContext('2d');
    humidityChart = new Chart(humCtx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Humidity (%)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Humidity (%)'
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'second'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }]
            }
        }
    });

    // Event listener for the "Refresh Data" button
    document.getElementById('refresh-button').addEventListener('click', function() {
        fetchDataAndUpdateCharts();
    });

    // Fetch initial data when the page loads
    fetchDataAndUpdateCharts();

    // Function to fetch data and update the charts
    function fetchDataAndUpdateCharts() {
        // Make an AJAX request to the /update-temp-humid API
        fetch('/update-temp-humid', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // Update the charts with the received data
                updateTemperatureChart(data.temperature);
                updateHumidityChart(data.humidity);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Function to be called every 2 seconds
    setInterval(fetchDataAndUpdateCharts, 2000);
});
