/*

easy to show system performance and network flow
base on  http://blog.bitjuice.com.au/2013/02/using-d3-js-to-visualise-hierarchical-classification/

features:
1)tree and connectivity(network) are both supported.
2)draggable nodes.
3)able to custom the config and actions

bug fix:
change dom property to class instead of dumplicated id

*/
function graph(d3) {
  //step 0, new graph() ,import "http://d3js.org/d3.v3.min.js" to get d3

  //step 1, custom the config
  this.config = {
    bg_size: {
      width: 1000,
      height: 700
    },
    edge_def_width: 5,
    edge_show_arrow: true,
    node_draggable: true,
    show_performance_bar: true,
  }

  var self = this;
  var cluster = d3.layout.cluster().size([self.config.bg_size.height, self.config.bg_size.width - 160]);


  /// step 2, custom the actions
  var showTitleAction;
  var showSubheadAction;
  var showDescriptionAction;
  var showPathDesc;

  this.showTitle = function (f) {
    showTitleAction = f;
  }

  this.showSubhead = function (f) {
    showSubheadAction = f;
  }

  this.showDescription = function (f) {
    showDescriptionAction = f;
  }

  this.showPathDesc = function (f) {
    showPathDesc = f;
  }


  /// final step , bind some data

  this.bind = function (data) {

    /**
    忽略连通图中的回路，产生一棵树。
    这棵树符合cluster.nodes(tree)的调用要求（参见：https://github.com/mbostock/d3/wiki/Cluster-Layout）
    */
    var conv2tree = function (data) {
      var root = self.getRoot(data);
      var hasParentFlag = {}; //保证每个节点只有一个父节点，以便形成树状结构
      hasParentFlag[root.id] = true; //根节点不允许作为子节点
      self.traverseEdge(data, function (source, target) { //遍历每条边，即所有节点间关系
        if (!hasParentFlag[target.id] && source.id != target.id) { //首次被遍历到的target，作为source的子节点，后续将不被其它节点作为子节点
          if (!source.children) {
            source.children = [];
          }
          source.children.push(target);
          hasParentFlag[target.id] = true;
        }
      });
      return root;
    }


    /**
    通过cluster.nodes(tree)，为tree的每个节点计算x，y，depth等属性以便定位
    */
    var buildNodes = function (tree) {
      return cluster.nodes(tree);
    }

    /**
    建立节点之间各条边。
    如果直接调用cluster.links(nodes)，其只支持树状结构，回路会被丢弃，借此把所有边补充完整。
    */
    var buildLinks = function (data) {
      var result = [];
      self.traverseEdge(data, function (source, target, ref) {
        result.push({
          'source': source,
          'target': target,
          'ref': ref
        });
      });
      return result;
    }

    /**
    更新数据时保留原有节点的位置信息
    */
    var merge = function (nodes, links) {

      var oldData = [];
      if (self.nodes) { //原nodes存在，输出oldData
        self.nodes.forEach(function (d) {
          oldData[d.id] = d;
        });
      }
      if (oldData) { //用oldData里的数据覆盖现nodes里的数据
        nodes.forEach(function (d) {
          if (oldData[d.id]) {
            d.x = oldData[d.id].x;
            d.y = oldData[d.id].y;
          }
        });
      }


      self.nodes = nodes;
      self.links = links;

    }

    //1)连通图->树 参见：https://github.com/mbostock/d3/wiki/Cluster-Layout)
    //1)temporarily convert a connectivity to a tree
    var tree = conv2tree(data);
    //2)根据树状结构计算节点位置.
    //2)caculate for nodes' coords with <code>cluster.nodes(tree);</code>
    var nodes = buildNodes(tree);
    //3)因为连通图是网状而非树状，将所有边补充完整
    //3)fill in all the edges(links) of the connectivity
    var links = buildLinks(data);
    //4)与原有的数据做一次merge，保留位置等信息
    //4)do merge to keep info like node's position
    merge(nodes, links);
    //5)重绘
    //5)redraw
    self.redraw();
  }


  /// call redraw() if necessary (reconfig,recostom the actions, etc. )
  this.redraw = function () {
    var fontSize = 11
    var lineSpace = 2
    var boxHeight = 50
    var boxWidth = 125

    var width = self.config.bg_size.width;
    var height = self.config.bg_size.height;

    var yscale_performancebar = d3.scale.linear()
    .domain([0, 1])
    .rangeRound([boxHeight / 2, -boxHeight / 2])


    var diagonal = d3.svg.diagonal()
    .projection(function (d) {
      return [d.y - boxWidth / 2, d.x];
    });


    var _clear = function () {
      d3.select("svg").remove();

      svg = d3.select("#content").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(80,0)");

      svg.append("svg:defs").selectAll("marker")
      .data(["suit"])
      .enter().append("svg:marker")
      .attr("id", "idArrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");
    }

    var _redrawEdges = function () {


      var linksWithArrow = self.links;

      //to show arrow at the end of the path with fixed size, we have to copy each path with .stroke-width=1
      if (self.config.edge_show_arrow) {
        linksWithArrow = [];
        self.links.forEach(function (d) {

          var fake = {};

          for (prop in d) {
            fake[prop] = d[prop];
          }

          fake.faked = true; //copy each path with .faked=true as flag

          linksWithArrow.push(fake);
          linksWithArrow.push(d);


        })
      }



      var path = svg.selectAll(".link").data(linksWithArrow);


      // when new path arrives
      path.enter().insert("path", ":first-child")
      .attr("marker-end", function (d) {
        if (d.faked) return "url(#idArrow)";
      })
      .attr("id", function (d) {
        if (!d.faked) return "link" + d.ref.from + "-" + d.ref.to;
      })
      .attr("class", function (d) {
        return "link" + " link-" + d.ref.from + " link-" + d.ref.to;
      })
      .attr("d", diagonal)
      .transition()
      .duration(1000)
      .style("stroke-width", function (d) {
        if (d.faked) {
          return 1;
        }
        if (d.ref.edge_width) return Math.max(1, boxHeight / 2 * d.ref.edge_width); //won't become invisible if too thin
        else return self.config.edge_def_width; //default value
      })
      .style('stroke', function(d) { return d.ref.colour; });

      // when path changes
      path.attr("d", diagonal)

      // when path's removed
      path.exit().remove();




    }


    _clear();

    _redrawEdges();

    ///show description on each path(edge)
    if (showPathDesc) {
      svg.selectAll(".abc").data(self.links).enter().append("text").append("textPath")
      .attr("xlink:xlink:href", function (d) {
        return "#link" + d.ref.from + "-" + d.ref.to;
      }) //why not .attr("xlink:href",...)? this's a hack, see https://groups.google.com/forum/?fromgroups=#!topic/d3-js/vLgbiM4ki1g
      .attr("startOffset", "50%")
      .text(showPathDesc)
    }

    ///show each node with text

    var existingNodes = svg.selectAll(".node").data(self.nodes); //选中所有节点

    //矩形
    //draw rectangle
    var newNodes = existingNodes.enter().append("g");

    newNodes.attr("class", "node")
    .attr("id", function (d) {
      return "node-" + d.id
    })
    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    })
    .append("rect") //make nodes as rectangles OR:
    // .append("circle").attr('r',50) //make nodes as circles
    .attr('class', 'nodebox')
    .attr("x", -boxWidth / 2)
    .attr("y", -boxHeight / 2)
    .attr("width", boxWidth)
    .attr("height", boxHeight)





    if (self.config.node_draggable) {
      newNodes.call(d3.behavior.drag().origin(Object).on("drag", function (d) {

        //拖动时移动节点
        //translate the node
        function translate(x, y) {
          return {
            'x': x,
            'y': y
          }
        }
        var coord = eval(d3.select(this).attr("transform"));
        d3.select(this)
        .attr("transform", "translate(" + (coord.x + d3.event.dx) + "," + (coord.y + d3.event.dy) + ")")


        //拖动时重绘边
        //update node's coord ,then redraw affected edges
        d.x = d.x + d3.event.dy;
        d.y = d.y + d3.event.dx;

        _redrawEdges();


      }));
    }



    //红色柱状性能指示图
    //show performance bar
    if (self.config.show_performance_bar) {
      newNodes.append("rect")
      .attr('class', 'performancebar')
      .attr("x", boxWidth / 2 * 1.05)
      .attr("width", boxWidth / 10)
      .style("fill", "red")
      .style("stroke", "red")
      .attr("y", boxHeight / 2)
      .attr("height", 0)

      //计算柱状图高度
      existingNodes.select('.performancebar')
      .transition()
      .duration(1000)
      .attr("y", function (d) {
        return yscale_performancebar(d.load)
      })
      .attr("height", function (d) {
        return boxHeight / 2 - yscale_performancebar(d.load)
      })
    }

    ///构造文案容器
    ///text constructors

    //标题
    //node titles
    newNodes.append("text")
    .attr("class", "nodeTitle")
    .attr("y", -boxHeight / 2 + fontSize + 2 * lineSpace)
    .attr("text-anchor", "middle")

    //副标题
    //node subhead
    newNodes.append("text")
    .attr("text-anchor", "middle")
    .attr("class", "nodeText f1Text")
    .attr("y", -boxHeight / 2 + 2 * fontSize + 3 * lineSpace)

    newNodes.append("text")
    .attr("text-anchor", "middle")
    .attr("class", "nodeText f1Description")
    .attr("y", -boxHeight / 2 + 3 * fontSize + 4 * lineSpace)

    //详情矩阵
    //node body text
    newNodes.append("g")
    .attr("class", "confusionmatrix")
    .selectAll("g").data(function (d) {
      return d.confusionmatrix ? d.confusionmatrix : []
    })
    .enter().append("g")
    .attr("class", "rows")
    .attr("transform", function (d, i) {
      return "translate(" + (-15) + "," + (-boxHeight / 2 + (i + 3) * fontSize + (i + 4) * lineSpace) + ")";
    })
    .selectAll("g").data(function (d) {
      return d
    })
    .enter().append("g")
    .attr("class", "columns")
    .attr("transform", function (d, i) {
      return "translate(" + i * 30 + ",0)";
    })
    .append("text")
    .attr("text-anchor", "middle")
    .attr("class", "nodeText")




    ///显示文案
    ///show text

    existingNodes.select(".nodeTitle").text(showTitleAction ? showTitleAction : function (d) {
      return d.id + ")" + d.name
    }); //标题
    existingNodes.select(".f1Text").text(showSubheadAction ? showSubheadAction : function (d) {
      return Math.round(d.load * 100) + "%"
    }); //副标题
    existingNodes.select(".f1Description").text(showDescriptionAction ? showDescriptionAction : function (d) {
      return ""
    }); //副标题


    existingNodes.select(".confusionmatrix") //详情矩阵
    .selectAll(".rows")
    .data(function (d) {
      return d.confusionmatrix ? d.confusionmatrix : []
    })
    .selectAll(".columns") //rows
    .data(function (d) {
      return d
    })
    .select("text")
    .text(function (d) {
      return d
    })
  }


  /**
  返回根节点
  return the root node
  */
  this.getRoot = function (data) {
    return data['0'];
  };

  /**
  遍历所有节点
  traverse all nodes
  callback(node)
  */
  this.traverse = function (data, callback) {
    if (!data) console.error('data is null')

    function _init() {
      var i;
      for (i in data) {
        data[i].visited = false;
      }
    }

    function _traverse(pt, callback) {
      if (!pt) {
        return;
      }
      pt.visited = true;
      console.debug("traverse node:" + pt.id);
      callback(pt);
      if (pt.ref) {
        pt.ref.forEach(function (ref) {
          var childNode = data[ref.to.toString()];
          if (childNode && !childNode.visited) {
            _traverse(childNode, callback);
          }
        })
      }



    }

    _init();
    _traverse(self.getRoot(data), callback);
  };

  /**
  遍历所有边
  traverse all edges
  callback(sourceNode,targetNode,ref)
  */
  this.traverseEdge = function (data, callback) {
    if (!data) console.error('data is null')

    self.traverse(data, function (node) {
      if (node.ref) {
        node.ref.forEach(function (ref) {
          var childNode = data[ref.to.toString()];
          if (childNode) {
            console.debug("traverse edge:" + node.id + "-" + childNode.id);
            callback(node, childNode, ref);
          }
        });
      }
    });
  };



}

/////////function(class) Graph end////////////////

function init_page(){
  // request data here
  var data = {
    "0": {
      id: 0,
      name: "Trigger Response",
      load: Math.random(),
      heading: "Processes input",
      description: "from bot user",
      ref: [{
        from: 0,
        to: 1,
        edge_width: 0.72,
        colour: "#FFDB58"
      }, {
        from: 0,
        to: 2,
        edge_width: 0.28,
        colour: "green"
      }, ]
    },
    "1": {
      id: 1,
      name: "Closed Domain",
      load: Math.random(),
      heading: "",
      description: "",
      ref: [{
        from: 1,
        to: 3,
        edge_width: 0.78,
        colour: "#FFDB58"
      }, {
        from: 1,
        to: 4,
        edge_width: 0.22,
        colour: "grey"
      }, ]
    },
    "2": {
      id: 2,
      name: "Open Domain",
      load: Math.random(),
      heading: "",
      description: "",
      ref: [{
        from: 2,
        to: 8,
        edge_width: 0.34,
        colour: "grey"
      }, {
        from: 2,
        to: 9,
        edge_width: 0.66,
        colour: "green"
      }]
    },
    "3": {
      id: 3,
      name: "Retrieval",
      load: Math.random(),
      heading: "",
      description: "",
      ref: [{
        from: 3,
        to: 5,
        edge_width: 0.12,
        colour: "grey"
      },{
        from: 3,
        to: 6,
        edge_width: 0.88,
        colour: "#FFDB58"
      }]
    },
    "4": {
      id: 4,
      name: "Generative",
      load: Math.random(),
      heading: "",
      description: "",
      ref: [{
        from: 4,
        to: 7,
        edge_width: 1.0,
        colour: "grey"
      }, ]
    },
    "5": {
      id: 5,
      name: "ML Classifier",
      load: Math.random(),
      heading: "Question Answer",
      description: "pair",
    },
    "6": {
      id: 6,
      name: "Semantic Query",
      load: Math.random(),
      heading: "In-house",
      description: "Ontology"
    },
    "7": {
      id: 7,
      name: "Seq2seq Deep Learning",
      load: Math.random(),
      heading: "Help Forums",
      description: ""
    },
    "8": {
      id: 8,
      name: "Retrieval",
      load: Math.random(),
      heading: "",
      description: "",
      ref: [{
        from: 8,
        to: 10,
        edge_width: 0.5,
        colour: "grey"
      },{
        from: 8,
        to: 11,
        edge_width: 0.5,
        colour: "grey"
      }]
    },
    "9": {
      id: 9,
      name: "Generative",
      load: Math.random(),
      heading: "",
      description: "",
      ref: [{
        from: 9,
        to: 12,
        edge_width: 1.0,
        colour: "green"
      }]
    },
    "10": {
      id: 10,
      name: "ML Classifier",
      load: Math.random(),
      heading: "Question Answer",
      description: "Pair"
    },
    "11": {
      id: 11,
      name: "Semantic Query",
      load: Math.random(),
      heading: "DBPedia",
      description: ""
    },
    "12": {
      id: 12,
      name: "Seq2seq Deep Learning",
      load: Math.random(),
      heading: "Movie Dialogues",
      description: ""
    },
  };

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


function refresh() {
  //request data here
  var data = {
    "0": {
      id: 0,
      name: "systemA",
      load: Math.random(),
      confusionmatrix: [
        [7293, 1224],
        [7293, 1224]
      ],
      ref: [{
        from: 0,
        to: 1,
        edge_width: Math.random(),
      }, {
        from: 0,
        to: 4,
        edge_width: Math.random(),
      }, {
        from: 0,
        to: 5,
        edge_width: Math.random(),
      },
      /*
      {
      from:0,
      to:6,
      edge_width:Math.random(),
    },
    */
    {
      from: 0,
      to: 7,
      edge_width: Math.random(),
    }, ]
  },
  "1": {
    id: 1,
    name: "systemB",
    load: Math.random(),
    confusionmatrix: [
      [7293, 1224],
      [7293, 1224]
    ],
    ref: [{
      from: 1,
      to: 2,
      edge_width: Math.random(),
    }, ]
  },
  "2": {
    id: 2,
    name: "systemC",
    load: Math.random(),
    confusionmatrix: [
      [7293, 1224],
      [7293, 1224]
    ],
    ref: [{
      from: 2,
      to: 3,
      edge_width: Math.random(),
    }, ]
  },
  "3": {
    id: 3,
    name: "systemD",
    load: Math.random(),
    confusionmatrix: [
      [7293, 1224],
      [7293, 1224]
    ],
  },
  "4": {
    id: 4,
    name: "systemE",
    load: Math.random(),
    confusionmatrix: [
      [7293, 1224],
      [7293, 1224]
    ],
    ref: [{
      from: 4,
      to: 2,
      edge_width: Math.random(),
    }, {
      from: 4,
      to: 8,
      edge_width: Math.random(),
    }, ]
  },
  "5": {
    id: 5,
    name: "systemF",
    load: Math.random(),
    confusionmatrix: [
      [7293, 1224],
      [7293, 1224]
    ],
  },
  "8": { // change 6 to 8
    id: 8,
    name: "systemI",
    load: Math.random(),
    confusionmatrix: [
      [7293, 1224],
      [7293, 1224]
    ],
    ref: [{
      from: 8,
      to: 7,
      edge_width: Math.random(),
    }, ]
  },
  "7": {
    id: 7,
    name: "systemH",
    load: Math.random(),
    confusionmatrix: [
      [7293, 1224],
      [7293, 1224]
    ],
    ref: [{
      from: 7,
      to: 3,
      edge_width: Math.random(),
    }, ]
  },
};

myGraph.bind(data);

}

var myGraph = new graph(d3); //http://d3js.org/
init_page();
