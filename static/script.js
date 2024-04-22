document.addEventListener('DOMContentLoaded', function() {
    let temperatureChart;
    let humidityChart;
    let temperatureData = [];
    let humidityData = [];

    // Function to calculate the average of an array of numbers
    function calculateAverage(numbers) {
        if (numbers.length === 0) return NaN;
        const sum = numbers.reduce((acc, curr) => acc + curr, 0);
        return sum / numbers.length;
    }

    // Function to update temperature and humidity values
    function updateValues(temperature, humidity) {
        const roundedTemp = Math.round(temperature * 100) / 100;
        const roundedHum = Math.round(humidity * 100) / 100;
        document.getElementById('bedroom-temp').innerText = roundedTemp + ' °C';
        document.getElementById('bedroom-humidity').innerText = roundedHum + ' %';
        updateStatistics();
    }

    // Event listener for the "Refresh Data" button
    document.getElementById('refresh-button').addEventListener('click', fetchDataAndUpdateCharts);

    // Function to fetch data and update the charts
    function fetchDataAndUpdateCharts() {
        // Make an AJAX request to the /update-temp-humid API
        fetch('/update-temp-humid', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data); // Log fetched data
                // Update the HTML values and charts with the received data
                updateValues(data.temperature, data.humidity);

                var time = new Date(); // Current time
                temperatureData.push({ x: time, y: data.temperature });
                humidityData.push({ x: time, y: data.humidity });

                // Log data being passed to charts
                console.log('Temperature data:', temperatureData);
                console.log('Humidity data:', humidityData);

                // Update the datasets for both temperature and humidity charts
                temperatureChart.data.datasets[0].data = temperatureData;
                humidityChart.data.datasets[0].data = humidityData;

                // Update chart labels
                temperatureChart.data.labels.push(time);
                humidityChart.data.labels.push(time);

                // Update both charts
                temperatureChart.update();
                humidityChart.update();

                // Update statistics
                updateStatistics();
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
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                x: {
                    type: 'time',
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    ticks: {
                        maxRotation: 0 // Prevents x-axis labels from rotating
                    }
                }
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
                y: {
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    }
                },
                x: {
                    type: 'time',
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    ticks: {
                        maxRotation: 0 // Prevents x-axis labels from rotating
                    }
                }
            }
        }
    });

    // Fetch initial data when the page loads
    fetchDataAndUpdateCharts();

    // Function to be called every 2 seconds
    setInterval(fetchDataAndUpdateCharts, 2000);
});
