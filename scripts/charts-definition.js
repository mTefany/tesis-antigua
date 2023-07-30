// Create the charts when the web page loads
window.addEventListener('load', onload);

function onload(event){
  chartT = createSensor1ValueChart();
  chartH = createSensor2ValueChart();
  chartP = createSensor3ValueChart();
}

// Create Sensor1Value Chart
function createSensor1ValueChart() {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-sensor1value',
      type: 'spline' 
    },
    series: [
      {
        name: 'BME280'
      }
    ],
    title: { 
      text: undefined
    },
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Sensor1Value Celsius Degrees' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}

// Create Sensor2Value Chart
function createSensor2ValueChart(){
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-sensor2value',
      type: 'spline'  
    },
    series: [{
      name: 'BME280'
    }],
    title: { 
      text: undefined
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      },
      series: { 
        color: '#50b8b4' 
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Sensor2Value (%)' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}

// Create Sensor3Value Chart
function createSensor3ValueChart() {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-sensor3value',
      type: 'spline'  
    },
    series: [{
      name: 'BME280'
    }],
    title: { 
      text: undefined
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      },
      series: { 
        color: '#A62639' 
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Sensor3Value (hPa)' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}