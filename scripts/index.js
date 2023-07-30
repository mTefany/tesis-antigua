// convert epochtime to JavaScripte Date object
function epochToJsDate(epochTime) {
  return new Date(epochTime * 1000);
}

// convert time to sen2an-readable format YYYY/MM/DD HH:MM:SS
function epochToDateTime(epochTime) {
  var epochDate = new Date(epochToJsDate(epochTime));
  var dateTime = epochDate.getFullYear() + "/" +
    ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
    ("00" + epochDate.getDate()).slice(-2) + " " +
    ("00" + epochDate.getHours()).slice(-2) + ":" +
    ("00" + epochDate.getMinutes()).slice(-2) + ":" +
    ("00" + epochDate.getSeconds()).slice(-2);

  return dateTime;
}

// function to plot values on charts
function plotValues(chart, timestamp, value) {
  var x = epochToJsDate(timestamp).getTime();
  var y = Number(value);
  if (chart.series[0].data.length > 40) {
    chart.series[0].addPoint([x, y], true, true, true);
  } else {
    chart.series[0].addPoint([x, y], true, false, true);
  }
}

// DOM elements
const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector('#authentication-bar');
const tableContainerElement = document.querySelector('#table-container');
const chartsRangeInputElement = document.getElementById('charts-range');
const loadDataButtonElement = document.getElementById('load-data');
// const viewDataButtonElement = document.getElementById('view-data-button');

// DOM elements for sensor readings
const cardsReadingsElement = document.querySelector("#cards-div");
const gaugesReadingsElement = document.querySelector("#gauges-div");
const chartsDivElement = document.querySelector('#charts-div');
const sen1Element = document.getElementById("sen1");
const sen2Element = document.getElementById("sen2");
const sen3Element = document.getElementById("sen3");
const updateElement = document.getElementById("lastUpdate")

// MANAGE LOGIN/LOGOUT UI
const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loginElement.style.display = 'none';
    contentElement.style.display = 'block';
    authBarElement.style.display = 'block';
    userDetailsElement.style.display = 'block';
    userDetailsElement.innerHTML = user.email;

    // get user UID to get data from database
    var uid = user.uid;
    console.log(uid);

    // Database paths (with user UID)
    var dbPath = 'UsersData/' + uid.toString() + '/readings';
    var chart3ath = 'UsersData/' + uid.toString() + '/charts/range';

    // Database references
    var dbRef = firebase.database().ref(dbPath);
    var chartRef = firebase.database().ref(chart3ath);

    // CHARTS
    // Number of readings to plot on charts
    var chartRange = 0;
    // Get number of readings to plot saved on database (runs when the page first loads and whenever there's a change in the database)
    chartRef.on('value', snapshot => {
      chartRange = Number(snapshot.val());
      console.log(chartRange);
      // Delete all data from charts to update with new values when a new range is selected
      chart1.destroy();
      chart2.destroy();
      chart3.destroy();
      // Render new charts to display new range of data
      chart1 = createSensor1ValueChart();
      chart2 = createSensor2ValueChart();
      chart3 = createSensor3ValueChart();
      // Update the charts with the new range
      // Get the latest readings and plot them on charts (the number of plotted readings corresponds to the chartRange value)
      dbRef.orderByKey().limitToLast(chartRange).on('child_added', snapshot => {
        var jsonData = snapshot.toJSON(); // example: {sensor1Value: 25.02, sensor2Value: 50.20, sensor3Value: 1008.48, timestamp:1641317355}
        // Save values on variables
        var sensor1Value = jsonData.sensor1Value;
        var sensor2Value = jsonData.sensor2Value;
        var sensor3Value = jsonData.sensor3Value;
        var timestamp = jsonData.timestamp;
        // Plot the values on the charts
        plotValues(chart1, timestamp, sensor1Value);
        plotValues(chart2, timestamp, sensor2Value);
        plotValues(chart3, timestamp, sensor3Value);
      });
    });

      // Update database with new range (input field)
    chartsRangeInputElement.onchange = () =>{
      chartRef.set(chartsRangeInputElement.value);
    };

    // CARDS
    // Get the latest readings and display on cards
    dbRef.orderByKey().limitToLast(1).on('child_added', snapshot => {
      var jsonData = snapshot.toJSON(); // example: {sensor1Value: 25.02, sensor2Value: 50.20, sensor3Value: 1008.48, timestamp:1641317355}
      var sensor1Value = jsonData.sensor1Value;
      var sensor2Value = jsonData.sensor2Value;
      var sensor3Value = jsonData.sensor3Value;
      var timestamp = jsonData.timestamp;
      // Update DOM elements
      sen1Element.innerHTML = sensor1Value;
      sen2Element.innerHTML = sensor2Value;
      sen3Element.innerHTML = sensor3Value;
      updateElement.innerHTML = epochToDateTime(timestamp);
    });

    // GAUGES
    // Get the latest readings and display on gauges
    dbRef.orderByKey().limitToLast(1).on('child_added', snapshot => {
      var jsonData = snapshot.toJSON(); // example: {sensor1Value: 25.02, sensor2Value: 50.20, sensor3Value: 1008.48, timestamp:1641317355}
      var sensor1Value = jsonData.sensor1Value;
      var sensor2Value = jsonData.sensor2Value;
      var sensor3Value = jsonData.sensor3Value;
      var timestamp = jsonData.timestamp;
      // Update DOM elements
      var gauge1 = createSensor1ValueGauge();
      var gauge2 = createSensor2ValueGauge();
      var gauge3 = createSensor3ValueGauge();
      gauge1.draw();
      gauge2.draw();
      gauge3.draw();
      gauge1.value = sensor1Value;
      gauge2.value = sensor2Value;
      gauge3.value = sensor3Value;
      updateElement.innerHTML = epochToDateTime(timestamp);
    });

    tableContainerElement = createTable();

    // TABLE
    var lastReadingTimestamp; //saves last timestamp displayed on the table
    // Function that creates the table with the first 100 readings
    function createTable() {
      //   // append all data to the table
      var firstRun = true;
      dbRef.orderByKey().limitToLast(100).on('child_added', function (snapshot) {
        if (snapshot.exists()) {
          var jsonData = snapshot.toJSON();
          console.log(jsonData);
          var sensor1Value = jsonData.sensor1Value;
          var sensor2Value = jsonData.sensor2Value;
          var sensor3Value = jsonData.sensor3Value;
          var timestamp = jsonData.timestamp;
          var content = '';
          content += '<tr>';
          content += '<td>' + epochToDateTime(timestamp) + '</td>';
          content += '<td>' + sensor1Value + '</td>';
          content += '<td>' + sensor2Value + '</td>';
          content += '<td>' + sensor3Value + '</td>';
          content += '</tr>';
          $('#tbody').prepend(content);
          // Save lastReadingTimestamp --> corresponds to the first timestamp on the returned snapshot data
          if (firstRun) {
            lastReadingTimestamp = timestamp;
            firstRun = false;
            console.log(lastReadingTimestamp);
          }
        }
      });
    };

    // append readings to table (after pressing More results... button)
    function appendToTable() {
      var dataList = []; // saves list of readings returned by the snapshot (oldest-->newest)
      var reversedList = []; // the same as previous, but reversed (newest--> oldest)
      console.log("APEND");
      dbRef.orderByKey().limitToLast(100).endAt(lastReadingTimestamp).once('value', function (snapshot) {
        // convert the snapshot to JSON
        if (snapshot.exists()) {
          snapshot.forEach(element => {
            var jsonData = element.toJSON();
            dataList.push(jsonData); // create a list with all data
          });
          lastReadingTimestamp = dataList[0].timestamp; //oldest timestamp corresponds to the first on the list (oldest --> newest)
          reversedList = dataList.reverse(); // reverse the order of the list (newest data --> oldest data)

          var firstTime = true;
          // loop through all elements of the list and append to table (newest elements first)
          reversedList.forEach(element => {
            if (firstTime) { // ignore first reading (it's already on the table from the previous query)
              firstTime = false;
            }
            else {
              var sensor1Value = element.sensor1Value;
              var sensor2Value = element.sensor2Value;
              var sensor3Value = element.sensor3Value;
              var timestamp = element.timestamp;
              var content = '';
              content += '<tr>';
              content += '<td>' + epochToDateTime(timestamp) + '</td>';
              content += '<td>' + sensor1Value + '</td>';
              content += '<td>' + sensor2Value + '</td>';
              content += '<td>' + sensor3Value + '</td>';
              content += '</tr>';
              $('#tbody').append(content);
            }
          });
        }
      });
    }

    loadDataButtonElement.addEventListener('click', (e) => {
      appendToTable();
    });

    // IF USER IS LOGGED OUT
  } else {
    // toggle UI elements
    loginElement.style.display = 'block';
    authBarElement.style.display = 'none';
    userDetailsElement.style.display = 'none';
    contentElement.style.display = 'none';
  }
}