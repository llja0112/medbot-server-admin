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

function changeInformation(data){
  // domainTypeOutput
  // dataRepresentationOutput
  // botReplyOutput
  // selectedModuleOutput
  // selectionReasonOutput
  var transformedData = transformData(data.msgStatusData);
  myGraph.bind(transformedData);

  $('#selectedModuleOutput').html(data.module);
  $('#selectionReasonOutput').html("Module is selected with <b>" + data.confidence*100 + "%</b> of confidence.");
  $('#botReplyOutput').html(data.message);
}

var myGraph = new graph(d3); //http://d3js.org/
$(document).ready(function(){
  var socket = io('http://localhost:5000');

  init_page();

  socket.on('new message', function (data) {
    changeInformation(data);
  });
});
