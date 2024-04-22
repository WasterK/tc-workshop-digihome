document.addEventListener('DOMContentLoaded', function() {
    // Import necessary modules from Chart.js



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

            // Filter data for the last 30 seconds
            const thirtySecondsAgo = new Date(time.getTime() - 600 * 1000);
            temperatureData = temperatureData.filter(item => item.x > thirtySecondsAgo);
            humidityData = humidityData.filter(item => item.x > thirtySecondsAgo);

            // Update the datasets for both temperature and humidity charts
            temperatureChart.data.datasets[0].data = temperatureData;
            humidityChart.data.datasets[0].data = humidityData;

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

    // Function to calculate the average of an array of numbers
    function calculateAverage(numbers) {
        if (numbers.length === 0) return NaN;
        const sum = numbers.reduce((acc, curr) => acc + curr, 0);
        return sum / numbers.length;
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
