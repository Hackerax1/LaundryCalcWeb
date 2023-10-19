document.addEventListener('DOMContentLoaded', function () {
    var timer;
    var completionTime;
    var elementIDs = ["washDuration", "dryDuration", "washerNumber", "dryerNumber", "loadsNumber", "startTime"];
    var textElementIDs = ["totalTime", "completionTime", "timeRemaining"];

    function getElementValue(id) {
        var element = document.getElementById(id);
        return element ? element.value : "";
    }

    function setElementValue(id, value) {
        var element = document.getElementById(id);
        if (element) {
            if (id === "completionTime" || id === "timeRemaining" || id === "totalTime") {
                element.textContent = value;
            } else {
                element.value = value;
            }
        }
    }

    document.getElementById('calculateBtn').addEventListener('click', function (event) {
        event.preventDefault();
        var allFieldsFilled = elementIDs.every(function (id) {
            return getElementValue(id) !== "";
        });

        if (!allFieldsFilled) {
            alert("Please fill out all fields");
        } else {
            var variables = {};
            elementIDs.forEach(function (id) {
                variables[id] = id === "startTime" ? getElementValue(id) : parseInt(getElementValue(id));
                console.log(id + ": " + variables[id]);
            });

            // Perform calculations
            var machines = Math.min(variables.washerNumber, variables.dryerNumber);
            var numCycles = Math.ceil(variables.loadsNumber / machines);
            // check if washDuration is less than dryDuration
            if (variables.washDuration < variables.dryDuration) {
                // if washDuration is less than dryDuration
                var totalTime = (variables.washDuration + variables.dryDuration) + ((variables.dryDuration) * (numCycles - 1));
            }
            else {
                var totalTime = (variables.washDuration + variables.dryDuration) * numCycles;
            }
            // Convert total time to hours and minutes
            var totalHours = Math.floor(totalTime / 60);
            var totalMinutes = totalTime % 60;
            var formattedTotalTime = totalHours.toString().padStart(2, '0') + ":" + totalMinutes.toString().padStart(2, '0');
            // Calculate completion time
            var startTimeParts = variables.startTime.split(":");
            var startHour = parseInt(startTimeParts[0]);
            var startMinute = parseInt(startTimeParts[1]);
            completionTime = new Date();
            completionTime.setHours(startHour);
            completionTime.setMinutes(startMinute);
            completionTime.setMinutes(completionTime.getMinutes() + totalTime);
            // Convert completion hour to 12-hour format with AM/PM
            var completionHours = completionTime.getHours() % 12 || 12;
            var completionMinutes = completionTime.getMinutes().toString().padStart(2, '0');
            var amPm = completionTime.getHours() < 12 ? 'AM' : 'PM';
            // Format the completion time
            var completionTimeFormatted = completionHours + ":" + completionMinutes + " " + amPm;
            // Update the result elements
            setElementValue("totalTime", formattedTotalTime);
            setElementValue("completionTime", completionTimeFormatted);

        }
    });

    document.getElementById('timerBtn').addEventListener('click', function () {
        // Timer function
        timer = setInterval(function () {
            var now = new Date().getTime();
            var distance = completionTime - now;

            // When timer hits zero, play sound
            if (distance < 0) {
                clearInterval(timer);
                setElementValue("timeRemaining", "EXPIRED");
                var audio = new Audio('alarm.wav');
                audio.play();
            } else {
                // Calculate remaining time
                var hours = Math.floor(distance / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Format remaining time as HH:MM:SS
                var timeFormatted = hours.toString().padStart(2, '0') + ":" +
                    minutes.toString().padStart(2, '0') + ":" +
                    seconds.toString().padStart(2, '0');

                // Update the result element with remaining time
                setElementValue("timeRemaining", timeFormatted);
            }
        }, 1000);

        // Disable the timer button
        document.getElementById('timerBtn').disabled = true;
    });

    document.getElementById('resetBtn').addEventListener('click', function (event) {
        event.preventDefault();
        elementIDs.forEach(function (id) {
            document.getElementById(id).value = "";
        });
        textElementIDs.forEach(function (id) {
            setElementValue(id, "");
        });
        document.getElementById("startTime").value = "";
    });
});
