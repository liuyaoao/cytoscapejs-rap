// now is deprecated;2017-02-10
;(function(cxt){
  if (!window.graphConfig) {
		window.graphConfig = {};
	}
  var styleOptions = [
  {
    selector: 'node',
    style: {
      'height': 40,
      'width': 40,
      'shape' : 'rectangle',
      'background-color': '#FFF',
      // 'selection-box-color':'#932',
      'label': 'data(label)'
    }
  },
  {
    selector: 'edge',
    style: {
      'label': 'data(label)',
      'curve-style': 'bezier',
      'width': 3,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle'
    }
  },
  {
    selector: '.edgeSelected', //设置被选中的样式。
    style: {
      'line-color':'#321',
      'target-arrow-color': '#321',
      'width':3
    }
  },
  {
    selector: '.top-center',
    style: {
      'text-valign': 'top',
      'text-halign': 'center'
    }
  },
  {
    selector:'.img_server',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/server.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_servers',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/servers.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_application',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/application.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_applications',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/applications.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_database',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/database.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_earth',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/earth.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_equipment',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/equipment.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_firewall',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/firewall.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_middleware',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/middleware.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_network',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/network.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_storage',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/storage.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_virtualmachine',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/virtualmachine.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_website',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/website.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.img_wirelessnetwork',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/wirelessnetwork.png',
      'background-fit':'contain'
    }
  },
  {
    selector:'.textRotation',
    style:{
      'text-rotation':'autorotate'
    }
  },
  {
    selector: '.bottom-center',
    style: {
      'text-valign': 'bottom',
      'text-halign': 'center'
    }
  }];

  var layout_grid = {
    name: 'grid',
    fit: true, // whether to fit the viewport to the graph
    padding: 30, // padding used on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
    condense: false, // uses all available space on false, uses minimal space on true
    rows: undefined, // force num of rows in the grid
    cols: undefined, // force num of columns in the grid
    position: function( node ){}, // returns { row, col } for element
    sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: undefined, // callback on layoutready
    stop: undefined // callback on layoutstop
  };
  var layout_circle = {
    name: 'circle',
    fit: true, // whether to fit the viewport to the graph
    padding: 30, // the padding on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
    radius: undefined, // the radius of the circle
    startAngle: 3 / 2 * Math.PI, // where nodes start in radians
    sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
    clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
    sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: undefined, // callback on layoutready
    stop: undefined // callback on layoutstop
  };

  var layout_concentric = {
    name: 'concentric',
    fit: true, // whether to fit the viewport to the graph
    padding: 30, // the padding on fit
    startAngle: 3 / 2 * Math.PI, // where nodes start in radians
    sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
    clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
    equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
    minNodeSpacing: 60, // min spacing between outside of nodes (used for radius adjustment)
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    height: undefined, // height of layout area (overrides container height)
    width: undefined, // width of layout area (overrides container width)
    concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
    return node.degree();
    },
    levelWidth: function( nodes ){ // the variation of concentric values in each level
    return nodes.maxDegree() / 4;
    },
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: undefined, // callback on layoutready
    stop: undefined // callback on layoutstop
  };

  var layout_breadthfirst = {
    name: 'breadthfirst',
    fit: true, // whether to fit the viewport to the graph
    directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
    padding: 30, // padding on fit
    circle: false, // put depths in concentric circles if true, put depths top down if false
    spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    roots: undefined, // the roots of the trees
    maximalAdjustments: 1, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: undefined, // callback on layoutready
    stop: undefined // callback on layoutstop
  };
  var layout_cose = {
    name: 'cose',
    ready: function(){}, // Called on `layoutready`
    stop: function(){}, // Called on `layoutstop`
    animate: true, // Whether to animate while running the layout
    // The layout animates only after this many milliseconds
    // (prevents flashing on fast runs)
    animationThreshold: 250,
    // Number of iterations between consecutive screen positions update
    // (0 -> only updated on the end)
    refresh: 20,
    fit: true, // Whether to fit the network view after when done
    padding: 30, // Padding on fit
    boundingBox: undefined,   // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    // Randomize the initial positions of the nodes (true) or use existing positions (false)
    randomize: false,
    componentSpacing: 100, // Extra spacing between components in non-compound graphs
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: function( node ){ return 400000; },
    nodeOverlap: 10, // Node repulsion (overlapping) multiplier
    // Ideal edge (non nested) length
    idealEdgeLength: function( edge ){ return 10; },
    edgeElasticity: function( edge ){ return 100; }, // Divisor to compute edge forces
    nestingFactor: 5, // Nesting factor (multiplier) to compute ideal edge length for nested edges
    gravity: 80, // Gravity force (constant)
    numIter: 1000, // Maximum number of iterations to perform
    initialTemp: 200,   // Initial temperature (maximum node displacement)
    coolingFactor: 0.95, // Cooling factor (how the temperature is reduced between consecutive iterations
    minTemp: 1.0, // Lower temperature threshold (below this point the layout will end)
    useMultitasking: true // Whether to use threading to speed up the layout
  };
  var layout_dagre = {
    name:'dagre',
    // dagre algo options, uses default value on undefined
    nodeSep: 100, // the separation between adjacent nodes in the same rank
    edgeSep: 100, // the separation between adjacent edges in the same rank
    rankSep: 100, // the separation between adjacent nodes in the same rank
    rankDir: 'LR', // 'TB' for top to bottom flow, 'LR' for left to right
    minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
    edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges
    // general layout options
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    ready: function(){}, // on layoutready
    stop: function(){} // on layoutstop
  };
  cxt.graphConfig.style = styleOptions;
  cxt.graphConfig.layout_grid = layout_grid;
  cxt.graphConfig.layout_circle = layout_circle;
  cxt.graphConfig.layout_concentric = layout_concentric;
  cxt.graphConfig.layout_breadthfirst = layout_breadthfirst;
  cxt.graphConfig.layout_cose = layout_cose;
  cxt.graphConfig.layout_dagre = layout_dagre;

  cxt.graphConfig.event = {
    MOUSE_HOVER:"onMouseHover",
    MOUSE_LEAVE:"onMouseLeave",
    NODE_SELECT:"onNodeSelect",
    EDGE_SELECT:"onEdgeSelect"
  };



})(window);
