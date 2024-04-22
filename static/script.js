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
        temperatureData.push(temperature);
        humidityData.push(humidity);

        // Update statistical analysis
        updateStatistics();
    }

    // Function to update statistical analysis
    function updateStatistics() {
        const avgTemperature = calculateAverage(temperatureData);
        const avgHumidity = calculateAverage(humidityData);
        document.getElementById('average-temp').innerText = avgTemperature.toFixed(2) + ' °C';
        document.getElementById('average-humidity').innerText = avgHumidity.toFixed(2) + ' %';
    }

    // Function to calculate average
    function calculateAverage(data) {
        if (data.length === 0) return 0;
        const sum = data.reduce((acc, val) => acc + val, 0);
        return sum / data.length;
    }

    // Event listener for the "Refresh Data" button
    document.getElementById('refresh-button').addEventListener('click', function() {
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
    });

    // Initialize the temperature chart
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
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
