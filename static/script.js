document.addEventListener('DOMContentLoaded', function() {
    let temperatureChart;
    let temperatureData = [];
    let humidityData = [];

    // Function to update temperature and humidity values
    function updateValues(temperature, humidity) {
        const roundedTemp = Math.round(temperature * 100) / 100;
        const roundedHum = Math.round(humidity * 100) / 100;
        document.getElementById('bedroom-temp').innerText = roundedTemp + ' °C';
        document.getElementById('bedroom-humidity').innerText = roundedHum + ' %';

        // Update chart data
        temperatureData.push({ x: new Date(), y: temperature });
        humidityData.push({ x: new Date(), y: humidity });

        // Update statistical analysis and chart
        updateStatistics();
        updateChart();
    }

    // Function to update statistical analysis
    function updateStatistics() {
        const avgTemperature = calculateAverage(temperatureData.map(data => data.y));
        const avgHumidity = calculateAverage(humidityData.map(data => data.y));
        document.getElementById('average-temp').innerText = isNaN(avgTemperature) ? '-- °C' : avgTemperature.toFixed(2) + ' °C';
        document.getElementById('average-humidity').innerText = isNaN(avgHumidity) ? '-- %' : avgHumidity.toFixed(2) + ' %';
    }

    // Function to calculate average
    function calculateAverage(data) {
        if (data.length === 0) return NaN;
        const sum = data.reduce((acc, val) => acc + val, 0);
        return sum / data.length;
    }

    // Function to update the chart with new data
    function updateChart() {
        temperatureChart.data.datasets[0].data = temperatureData;
        temperatureChart.data.datasets[1].data = humidityData;

        // Update x-axis scale based on data range
        const minX = Math.min(...temperatureData.map(data => data.x));
        const maxX = Math.max(...temperatureData.map(data => data.x));
        const timeRange = maxX - minX;

        if (timeRange < 60 * 1000) {
            // Less than 1 minute
            temperatureChart.options.scales.xAxes[0].time.unit = 'second';
        } else if (timeRange < 60 * 60 * 1000) {
            // Less than 1 hour
            temperatureChart.options.scales.xAxes[0].time.unit = 'minute';
        } else {
            // Otherwise, default to hours
            temperatureChart.options.scales.xAxes[0].time.unit = 'hour';
        }

        temperatureChart.update();
    }

    // Initialize the temperature chart
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }, {
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
                        labelString: 'Value'
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'hour', // Default to hours
                        tooltipFormat: 'MMM D, YYYY, h:mm:ss a'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }]
            }
        }
    });

    // Fetch initial data when the page loads
    fetch('/update-temp-humid', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            // Update the HTML values and chart with the received data
            updateValues(data.temperature, data.humidity);
        })
        .catch(error => {
            console.error('Error fetching initial data:', error);
        });

    // Function to be called every 2 seconds
    function fetchData() {
        // Make an AJAX request to the /update-temp-humid API
        fetch('/update-temp-humid', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // Update the HTML values and chart with the received data
                updateValues(data.temperature, data.humidity);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Call the fetchData function every 2 seconds (2000 milliseconds)
    setInterval(fetchData, 2000);
});
