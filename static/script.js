document.addEventListener('DOMContentLoaded', function() {
    let temperatureChart;
    let humidityChart;
    let temperatureData = [];
    let humidityData = [];

    // Function to update temperature and humidity values
    function updateValues(temperature, humidity) {
        const roundedTemp = Math.round(temperature * 100) / 100;
        const roundedHum = Math.round(humidity * 100) / 100;
        document.getElementById('bedroom-temp').innerText = roundedTemp + ' °C';
        document.getElementById('bedroom-humidity').innerText = roundedHum + ' %';
        updateStatistics();
    }

    // Function to update temperature chart data
    function updateTemperatureChart() {
        // const lastMinuteData = filterDataByTime(temperatureData, 60000); // Filter data for the last minute
        var time = new Date().toLocaleTimeString(); // Current time
        chart.data.labels.push(time);
        temperatureChart.data.datasets[0].data = lastMinuteData;
        // temperatureChart.options.scales.xAxes[0].time.max = new Date(); x// Set max value of x-axis to current time
        temperatureChart.update();
    }

    // Function to update humidity chart data
    function updateHumidityChart() {
        const lastMinuteData = filterDataByTime(humidityData, 60000); // Filter data for the last minute
        humidityChart.data.datasets[0].data = lastMinuteData;
        var time = new Date().toLocaleTimeString(); // Current time
        chart.data.labels.push(time);
        humidityChart.options.scales.xAxes[0].time.max = new Date(); // Set max value of x-axis to current time
        humidityChart.update();
    }

    // Event listener for the "Refresh Data" button
    document.getElementById('refresh-button').addEventListener('click', fetchDataAndUpdateCharts);

    // Function to fetch data and update the charts
    function fetchDataAndUpdateCharts() {
        // Make an AJAX request to the /update-temp-humid API
        fetch('/update-temp-humid', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // Update the HTML values and charts with the received data
                updateValues(data.temperature, data.humidity);
                // temperatureData.push(data.temperature);
                var time = new Date().toLocaleTimeString(); // Current time
                temperatureChart.data.labels.push(time);
                temperatureChart.data.datasets[0].data.push(temperature);
                temperatureChart.update();
                
                humidityChart.data.datasets[0].data.push(humidity)
                humidityChart.data.labels.push(time);
                humidityChart.update();
                // humidityData.push({ x: new Date(), y: data.humidity });
                // updateTemperatureChart();
                // updateHumidityChart();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Function to update statistical analysis
    function updateStatistics() {
        const avgTemperature = calculateAverage(temperatureData.map(data => data.y));
        const avgHumidity = calculateAverage(humidityData.map(data => data.y));
        document.getElementById('average-temp').innerText = isNaN(avgTemperature) ? '-- °C' : avgTemperature.toFixed(2) + ' °C';
        document.getElementById('average-humidity').innerText = isNaN(avgHumidity) ? '-- %' : avgHumidity.toFixed(2) + ' %';
    }

    // Function to filter data by time
    function filterDataByTime(data, timeLimit) {
        const now = new Date().getTime();
        return data.filter(point => now - point.x.getTime() <= timeLimit);
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
                    },
                    ticks: {
                        maxRotation: 0 // Prevents x-axis labels from rotating
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
                    },
                    ticks: {
                        maxRotation: 0 // Prevents x-axis labels from rotating
                    }
                }]
            }
        }
    });

    // Fetch initial data when the page loads
    fetchDataAndUpdateCharts();

    // Function to be called every 2 seconds
    setInterval(fetchDataAndUpdateCharts, 2000);
});
