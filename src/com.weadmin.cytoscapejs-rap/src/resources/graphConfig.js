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
    selector:'.imgServer',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/server.png',
      'background-fit':'cover'
    }
  },
  {
    selector:'.imgServers',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/servers.png',
      'background-fit':'cover'
    }
  },
  {
    selector:'.imgApplication',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/application.png',
      'background-fit':'cover'
    }
  },
  {
    selector:'.imgApplications',
    style:{
      'background-image':'rwt-resources/cytoscapejshandler/images/applications.png',
      'background-fit':'cover'
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

  var layout_random = {
    name: 'random',
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: undefined, // callback on layoutready
    stop: undefined // callback on layoutstop
  };
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
    fit: false, // whether to fit the viewport to the graph
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
    directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
    padding: 30, // padding on fit
    circle: false, // put depths in concentric circles if true, put depths top down if false
    spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    roots: undefined, // the roots of the trees
    maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: undefined, // callback on layoutready
    stop: undefined // callback on layoutstop
  };
  cxt.graphConfig.style = styleOptions;
  cxt.graphConfig.layout_random = layout_random;
  cxt.graphConfig.layout_grid = layout_grid;
  cxt.graphConfig.layout_circle = layout_circle;
  cxt.graphConfig.layout_concentric = layout_concentric;
  cxt.graphConfig.layout_breadthfirst = layout_breadthfirst;
})(window);
