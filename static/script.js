document.addEventListener('DOMContentLoaded', function() {
    let temperatureChart;
    let temperatureData = [];
    let humidityData = [];

    // Initialize the temperature chart
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatureData,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }, {
                label: 'Humidity (%)',
                data: humidityData,
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

    // Function to update the chart with new data
    function updateChart(temperature, humidity) {
        const now = new Date();

        // Update chart data
        temperatureData.push({ x: now, y: temperature });
        humidityData.push({ x: now, y: humidity });

        // Limit the number of data points shown on the chart (e.g., 50)
        const maxDataPoints = 50;
        if (temperatureData.length > maxDataPoints) {
            temperatureData.shift();
            humidityData.shift();
        }

        // Update the chart
        temperatureChart.update();

        // Adjust x-axis scale based on the time range of the data
        const minX = temperatureData[0].x.getTime();
        const maxX = temperatureData[temperatureData.length - 1].x.getTime();
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

        // Update the chart with the new x-axis scale
        temperatureChart.update();
    }

    // Event listener for the "Refresh Data" button
    document.getElementById('refresh-button').addEventListener('click', function() {
        // Make an AJAX request to the /update-temp-humid API
        fetch('/update-temp-humid', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // Update the chart with the received data
                updateChart(data.temperature, data.humidity);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    // Function to be called every 2 seconds
    function fetchData() {
        // Make an AJAX request to the /update-temp-humid API
        fetch('/update-temp-humid', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // Update the chart with the received data
                updateChart(data.temperature, data.humidity);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Call the fetchData function every 2 seconds (2000 milliseconds)
    setInterval(fetchData, 2000);
});
