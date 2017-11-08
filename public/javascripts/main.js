function init_page(){
  var msgStatusData = {
    'children':
    [
      {
        'child':
        [
          {'name': 'STRUCTURED', 'prob': 0},
          {'name': 'UNSTRUCTURED', 'prob': 0}
        ],
        'name': 'OPEN',
        'prob': 0.33000000000000002
      },
      { 'child':
        [
          {'child':
            [
              {'name': 'FIXEDQA', 'prob': 0},
              {'name': 'KNOWLEDGE', 'prob': 0}
            ],
            'name': 'STRUCTURED',
            'prob': 0
          },
          {'child':
            [
              {'name': 'CLASSIFIER', 'prob': 0},
              {'name': 'FORUM', 'prob': 0.57999999999999996}
            ],
            'name': 'UNSTRUCTURED',
            'prob': 1
          }
        ],
        'name': 'CLOSE',
        'prob': 0.66999999999999993}
    ],
    'name': 'DOMAIN',
    'prob': 1
  }

  var data = transformData(msgStatusData);

  //customize anything here
  myGraph.showTitle(function (d) {
    return d.name;
  });

  myGraph.showSubhead(function (d) {
    return d.heading;
  });

  myGraph.showDescription(function (d) {
    return d.description;
  });

  myGraph.showPathDesc(function (d) {
    return d.ref.edge_width.toFixed(2);
  });

  myGraph.bind(data);

}

function testGraph(){
  var msgStatusData = {
    'children':
    [
      {
        'child':
        [
          {'name': 'STRUCTURED', 'prob': 0},
          {'name': 'UNSTRUCTURED', 'prob': 0}
        ],
        'name': 'OPEN',
        'prob': 0.33000000000000002
      },
      { 'child':
        [
          {'child':
            [
              {'name': 'FIXEDQA', 'prob': 0.33333},
              {'name': 'KNOWLEDGE', 'prob': 1}
            ],
            'name': 'STRUCTURED',
            'prob': 1
          },
          {'child':
            [
              {'name': 'CLASSIFIER', 'prob': 0.2},
              {'name': 'FORUM', 'prob': 0.57999999999999996}
            ],
            'name': 'UNSTRUCTURED',
            'prob': 0
          }
        ],
        'name': 'CLOSE',
        'prob': 0}
    ],
    'name': 'DOMAIN',
    'prob': 1
  }

  var data = transformData(msgStatusData);
  myGraph.bind(data);
}

function edge_colour(prob1, prob2){
    if( prob1 > prob2 ) {
      return "#F1C40F";
    } else if ( prob1 == prob2 ) {
      return "#D5D8DC";
    } else {
      return "#EC7063";
    }
}


function transformData(msgStatusData){
  var data = {
    "0": {
      id: 0,
      name: msgStatusData.name,
      heading: "Processes input",
      description: "from bot user",
      ref: [{
        from: 0,
        to: 1,
        edge_width: msgStatusData.children[0].prob,
        colour: edge_colour(msgStatusData.children[0].prob, msgStatusData.children[1].prob)
      }, {
        from: 0,
        to: 2,
        edge_width: msgStatusData.children[1].prob,
        colour: edge_colour(msgStatusData.children[1].prob, msgStatusData.children[0].prob)
      }, ]
    },
    "1": {
      id: 1,
      name: msgStatusData.children[0].name,
      heading: "",
      description: "",
      ref: [{
        from: 1,
        to: 3,
        edge_width: msgStatusData.children[0].child[0].prob,
        colour: edge_colour(msgStatusData.children[0].child[0].prob, msgStatusData.children[0].child[1].prob)
      }, {
        from: 1,
        to: 4,
        edge_width: msgStatusData.children[0].child[1].prob,
        colour: edge_colour(msgStatusData.children[0].child[1].prob, msgStatusData.children[0].child[0].prob)
      }, ]
    },
    "2": {
      id: 2,
      name: msgStatusData.children[1].name,
      heading: "",
      description: "",
      ref: [{
        from: 2,
        to: 5,
        edge_width: msgStatusData.children[1].child[0].prob,
        colour: edge_colour(msgStatusData.children[1].child[0].prob, msgStatusData.children[1].child[1].prob)
      }, {
        from: 2,
        to: 6,
        edge_width: msgStatusData.children[1].child[1].prob,
        colour: edge_colour(msgStatusData.children[1].child[1].prob, msgStatusData.children[1].child[0].prob)
      }]
    },
    "3": {
      id: 3,
      name: msgStatusData.children[0].child[0].name,
      heading: "",
      description: ""
    },
    "4": {
      id: 4,
      name: msgStatusData.children[0].child[1].name,
      heading: "",
      description: ""
    },
    "5": {
      id: 5,
      name: msgStatusData.children[1].child[0].name,
      heading: "",
      description: "",
      ref: [{
        from: 5,
        to: 7,
        edge_width: msgStatusData.children[1].child[0].child[0].prob,
        colour: edge_colour(msgStatusData.children[1].child[0].child[0].prob, msgStatusData.children[1].child[0].child[1].prob)
      }, {
        from: 5,
        to: 8,
        edge_width: msgStatusData.children[1].child[0].child[1].prob,
        colour: edge_colour(msgStatusData.children[1].child[0].child[1].prob, msgStatusData.children[1].child[0].child[0].prob)
      }]
    },
    "6": {
      id: 6,
      name: msgStatusData.children[1].child[1].name,
      heading: "",
      description: "",
      ref: [{
        from: 6,
        to: 9,
        edge_width: msgStatusData.children[1].child[1].child[0].prob,
        colour: edge_colour(msgStatusData.children[1].child[1].child[0].prob, msgStatusData.children[1].child[1].child[1].prob)
      }, {
        from: 6,
        to: 10,
        edge_width: msgStatusData.children[1].child[1].child[1].prob,
        colour: edge_colour(msgStatusData.children[1].child[1].child[1].prob, msgStatusData.children[1].child[1].child[0].prob)
      }]
    },
    "7": {
      id: 7,
      name: msgStatusData.children[1].child[0].child[0].name,
      heading: "",
      description: ""
    },
    "8": {
    id: 8,
      name: msgStatusData.children[1].child[0].child[1].name,
      heading: "",
      description: ""
    },
    "9": {
      id: 9,
      name: msgStatusData.children[1].child[1].child[0].name,
      heading: "",
      description: ""
    },
    "10": {
      id: 10,
      name: msgStatusData.children[1].child[1].child[1].name,
      heading: "",
      description: ""
    }
  }
  return data;
}

function groupby(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function changeInformation(data){
  // domainTypeOutput
  // dataRepresentationOutput
  // botReplyOutput
  // selectedModuleOutput
  // selectionReasonOutput
  var transformedData = transformData(data.tree);
  myGraph.bind(transformedData);

  var now = new Date(Date.now());
  var timestamp = now.toISOString().slice(0,10) + " " + now.toString().slice(16,24);
  historicalData.push({
    "module_name": data.module_info.module_name,
    "timestamp": timestamp,
    "module_confidence": data.module_info.confidence*100
  });

  $("#historicalDataTbody").prepend(
    "<tr>" +
      "<th scope='row'>" + historicalData.length  + "</th>" +
      "<td>" + timestamp + "</td>" +
      "<td>" + data.response_info.user_question + "</td>" +
      "<td>" + data.module_info.module_name + "</td>" +
      "<td>" + data.response_info.bot_reply + "</td>" +
      "<td>" + Math.round(data.module_info.confidence*10000)/100 + "%</td>" +
    "</tr>"
  );

  $('#selectedModuleOutput').html(data.module_info.module_name);
  $('#selectionReasonOutput').html("Module is selected with <b>" + Math.round(data.module_info.confidence*10000)/100 + "%</b> of confidence.");
  $('#userQuestionOutput').html(data.response_info.user_question);
  $('#botReplyOutput').html(data.response_info.bot_reply);

  grouped = groupby(historicalData,'module_name');

  var labels = [];
  var values = [];
  for (var key in grouped) {
    labels.push(key);
    values.push(grouped[key].length);
  }
  pie_data[0].labels = labels;
  pie_data[0].values = values;
  Plotly.update('responses_summary', pie_data, pie_layout);

  var x_time = [];
  var y_confidence = [];
  for ( i=0; i < historicalData.length; i++) {
    x_time.push(historicalData[i].timestamp);
    y_confidence.push(historicalData[i].module_confidence);
  }
  time_trace.x = x_time;
  time_trace.y = y_confidence;
  Plotly.update('confidences_summary', [time_trace], time_layout);
}

var myGraph = new graph(d3); //http://d3js.org/

var pie_data = [{
  values: [1, 1, 1],
  labels: ['scripted', 'fourm', 'online' ],
  name: 'Module selection ratio',
  hoverinfo: 'label+percent+name',
  hole: .5,
  type: 'pie'
}];
var pie_layout = {
  title: 'Ratio of Modules used',
  annotations: [
    {
      font: {
        size: 20
      },
      showarrow: false,
      text: 'Ratio',
      x: 0.5,
      y: 0.5
    }
  ],
  height: 500,
  width: 500,
  showlegend: false
};

var now = new Date( Date.now() );
var justnow = new Date( Date.now() - 2000 );
var time_trace = {
  type: "scatter",
  mode: "lines",
  name: 'Confidences',
  x: [justnow.toISOString().slice(0,10) + " " + justnow.toString().slice(16,24),
      now.toISOString().slice(0,10) + " " + now.toString().slice(16,24)],
  y: [50, 78],
  marker: {color: "#17BECF", size: 8},
  line: {color: '#17BECF', width: 4}
}
var time_layout = {
  title: 'Basic Time Series',
  height: 500,
  width: 500,
  showlegend: false
};

var historicalData = []

$(document).ready(function(){
  var socket = io('http://localhost:5000');

  init_page();

  socket.on('new message', function (data) {
    changeInformation(data);
  });

  Plotly.newPlot('responses_summary', pie_data, pie_layout);
  Plotly.newPlot('confidences_summary', [time_trace], time_layout);
});
