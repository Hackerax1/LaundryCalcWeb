document.addEventListener('DOMContentLoaded', function () {
    var timer;
    var completionTime;
    var washTimer;
    var dryTimer;
    var washTime;
    var dryTime;
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
            if (numCycles === 1) {
                //hide wash button
                document.getElementById('washBtn').style.display = 'none';
                document.getElementById('nextLoadLabel').style.display = 'none';
            }
            // check if washDuration is less than dryDuration
            washTime = variables.washDuration
            dryTime = variables.dryDuration
            var washTimeFormatted = washTime.toString().padStart(2, '0') + ":" + "00";
            var dryTimeFormatted = dryTime.toString().padStart(2, '0') + ":" + "00";
    

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
            setElementValue("washTimer", washTimeFormatted);
            setElementValue("dryTimer", dryTimeFormatted);
            setElementValue("timeRemaining", formattedTotalTime);
            setElementValue("completionTime", completionTimeFormatted);

        }
    });

    function bigTimer() {
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
    }

    document.getElementById('timerBtn').addEventListener('click', function () {
        // Timer function
        timer = setInterval(bigTimer, 1000);
        washTimer = setInterval(function () {
            var now = new Date().getTime();
            var distance = washTime - now;


            // When timer hits zero, play sound
            if (distance < 0) {
                clearInterval(washTimer);
                clearInterval(timer);
                setElementValue("washTimer", "EXPIRED");
                var audio = new Audio('alarm.wav');
                audio.play();
            } else {
                // Calculate remaining time
                var washHours = Math.floor(distance / (1000 * 60 * 60));
                var washMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var washSeconds = Math.floor((distance % (1000 * 60)) / 1000);
                // Format remaining time as HH:MM:SS
                var washTimeFormatted = washHours.toString().padStart(2, '0') + ":" +
                    washMinutes.toString().padStart(2, '0') + ":" +
                    washSeconds.toString().padStart(2, '0');
                setElementValue("washTimer", washTimeFormatted);
            }
        }, 1000);
        // Disable the timer button
        document.getElementById('timerBtn').disabled = true;
    });


    document.getElementById('dryerBtn').addEventListener('click', function () {
        // Timer function
        dryTimer = setInterval(function () {
            var now = new Date().getTime();
            var distance = dryTime - now;

            // When timer hits zero, play sound
            if (distance < 0) {
                clearInterval(dryTimer);
                setElementValue("dryTimer", "EXPIRED");
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
                setElementValue("washTimer", timeFormatted);
                setElementValue("timeRemaining", timeFormatted);
            }
        }, 1000);
        timer = setInterval(bigTimer, 1000);
    });

    document.getElementById("washBtn").addEventListener('click', function () {
        // Timer function
        washTimer = setInterval(function () {
            var now = new Date().getTime();
            var distance = washTime - now;


            // When timer hits zero, play sound
            if (distance < 0) {
                clearInterval(washTimer);
                clearInterval(timer);
                setElementValue("washTimer", "EXPIRED");
                var audio = new Audio('alarm.wav');
                audio.play();
            } else {
                // Calculate remaining time
                var washHours = Math.floor(distance / (1000 * 60 * 60));
                var washMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var washSeconds = Math.floor((distance % (1000 * 60)) / 1000);
                // Format remaining time as HH:MM:SS
                var washTimeFormatted = washHours.toString().padStart(2, '0') + ":" +
                    washMinutes.toString().padStart(2, '0') + ":" +
                    washSeconds.toString().padStart(2, '0');
                setElementValue("washTimer", washTimeFormatted);
            }
        }, 1000);
        timer = setInterval(bigTimer, 1000);
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
        document.getElementById('timerBtn').disabled = false;
    });

});