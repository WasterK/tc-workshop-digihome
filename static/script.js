document.addEventListener('DOMContentLoaded', function() {
    // Function to update temperature and humidity values
    function updateValues(temperature, humidity) {
        const roundedTemp = Math.round(temperature * 100) / 100;
        const roundedHum = Math.round(humidity * 100) / 100
        document.getElementById('bedroom-temp').innerText = roundedTemp + ' °C';
        document.getElementById('bedroom-humidity').innerText = roundedHum + ' %';
    }

    // Event listener for the "Refresh Data" button
    document.getElementById('refresh-button').addEventListener('click', function() {
        // Make an AJAX request to the /update-temp-humid API
        fetch('/update-temp-humid', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // Update the HTML values with the received data
                updateValues(data.temperature, data.humidity);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    // Event listener for any custom logic triggering an update
    // (You might want to call this function when /update-temp-humid is POSTed)
    function updateFromSensor(temperature, humidity) {
        updateValues(temperature, humidity);
    }

    // Example: Trigger an update when the page loads
    fetch('/update-temp-humid', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            updateFromSensor(data.temperature, data.humidity);
        })
        .catch(error => {
            console.error('Error fetching initial data:', error);
        });

    // Function to be called every 2 seconds
    function myFunction() {
        // Make an AJAX request to the /update-temp-humid API
        fetch('/update-temp-humid', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                // Update the HTML values with the received data
                updateFromSensor(data.temperature, data.humidity);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Call the function every 2 seconds (2000 milliseconds)
    setInterval(myFunction, 2000);
});
