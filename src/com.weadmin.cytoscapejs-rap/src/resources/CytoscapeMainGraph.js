
;(function(cxt){
  if (!window.cytoscapejsgraph) {
		window.cytoscapejsgraph = {};
	}
  var CytoscapeMainGraph = function(){
    this.init.apply(this, arguments);
  }
  CytoscapeMainGraph.prototype = {
    init:function(options){
      this.container = options.container;
      this.uniqueId = options.uniqueId;
      this.dispatchEventCall = options.dispatchEventCall;
      this.callServerMethodCall = options.callServerMethodCall;
      this.graphContainer = null;
      this.cyInstance = null;
      this.initGraphCfg = '';
      this.initElement();
    },
    initElement:function(){
      var _this = this;
      var element = this.graphContainer= document.createElement( "div" );
      $(element).attr("id","cytoscapegraph");
	    element.style.position = "absolute";
	    element.style.left = "0";
      element.style.top = "30px";
      element.style.width = "100%";
	    element.style.height = "100%";
			// element.style.overflow="auto";
      $(this.container).append( element );

      setTimeout(function(){
        _this.initGraphOptions();
        _this.initGraphExtension();
        _this.addEvent();
        // console.log("init completed!!");
      },10);
    },
    addEvent:function(){
      var _this = this;
      var cy = this.cyInstance;
      cy.on('tap', function(event){ //在整个图形上加个点击事件。
        // cyTarget holds a reference to the originator
        // of the event (core or element)
        var evtTarget = event.cyTarget;

        if( evtTarget === cy ){  //在画布上鼠标的点击位置加一个节点。
            console.log('tap on background',event);
            _this.dispatchEventCall("tapblank",{x:event.cyPosition.x,y:event.cyPosition.y});
        } else {
          // console.log('tap on some element');
        }
      });
      cy.on('cxttap',function(event){ //mouse right click。
        var evtTarget = event.cyTarget;
        if(evtTarget !== cy){
          console.log('right click event:',event);

          _this.callServerMethodCall('right_click',{
              id:evtTarget._private.data['id'],
              label:evtTarget._private.data['label'],
              x:event.cyPosition.x,
              y:event.cyPosition.y
            });
        }
      });
      cy.on('tap', 'edge',function(event){ //click one edge line.
        var evtTarget = event.cyTarget;
        // cy.edges('.edgeSelected').removeClass("edgeSelected");
        evtTarget.toggleClass('edgeSelected');
        console.log('tap on edge: ',event);
      });
      cy.on('tap', 'node',function(event){ //click one edge line.
        var evtTarget = event.cyTarget;
        console.log('tap on node: ',event);
      });
      // cy.on('mouseover', 'node', function(event){
      //   var node = event.cyTarget;
      //   console.log( "node:mouse over event:" + node.id() );
      //   _this.callServerMethodCall(graphConfig.event.MOUSE_HOVER,{
      //       id:node.id(),
      //       label:node._private.data['label'],
      //       x:event.cyPosition.x,
      //       y:event.cyPosition.y
      //     });
      // });
      // cy.on('mouseout', 'node', function(event){
      //   var node = event.cyTarget;
      //   console.log( "node:mouse out event:" + node.id() );
      //   _this.callServerMethodCall(graphConfig.event.MOUSE_LEAVE,{
      //       id:node.id(),
      //       label:node._private.data['label'],
      //       x:event.cyPosition.x,
      //       y:event.cyPosition.y
      //     });
      // });
    },
    initGraphOptions:function(){
      var cy = cytoscape({
        container: document.getElementById('cytoscapegraph'),
        style:graphConfig.style,
        elements: []
      });
      this.cyInstance = cy;
      this.cyInstance.elements().qtip(graphConfig.qtipOptions);
    },
    initGraphExtension:function(){
      var cy = this.cyInstance;
      // the default values of each option are outlined below:
      var defaults = {
        preview: true, // whether to show added edges preview before releasing selection
        stackOrder: 4, // Controls stack order of edgehandles canvas element by setting it's z-index
        handleSize: 10, // the size of the edge handle put on nodes
        handleColor: '#ff0000', // the colour of the handle and the line drawn from it
        handleLineType: 'ghost', // can be 'ghost' for real edge, 'straight' for a straight line, or 'draw' for a draw-as-you-go line
        handleLineWidth: 1, // width of handle line in pixels
        handleIcon: false, // Pass an Image-object to use as icon on handle. Icons are resized according to zoom and centered in handle.
        handleOutlineColor: '#000000', // the colour of the handle outline
        handleOutlineWidth: 0, // the width of the handle outline in pixels
        handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
        handlePosition: 'middle top', // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
        hoverDelay: 150, // time spend over a target node before it is considered a target selection
        cxt: false, // whether cxt events trigger edgehandles (useful on touch)
        enabled: true, // whether to start the extension in the enabled state
        toggleOffOnLeave: true, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
        edgeType: function( sourceNode, targetNode ) {
          // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
          // returning null/undefined means an edge can't be added between the two nodes
          return 'flat';
        },
        loopAllowed: function( node ) {
          // for the specified node, return whether edges from itself to itself are allowed
          return false;
        },
        nodeLoopOffset: -50, // offset for edgeType: 'node' loops
        nodeParams: function( sourceNode, targetNode ) {
          // for edges between the specified source and target
          // return element object to be passed to cy.add() for intermediary node
          return {};
        },
        edgeParams: function( sourceNode, targetNode, i ) {
          // for edges between the specified source and target
          // return element object to be passed to cy.add() for edge
          // NB: i indicates edge index in case of edgeType: 'node'
          return {};
        },
        start: function( sourceNode ) {
          // fired when edgehandles interaction starts (drag on handle)
        },
        complete: function( sourceNode, targetNodes, addedEntities ) {
          // fired when edgehandles is done and entities are added
        },
        stop: function( sourceNode ) {
          // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
        }
      };
      cy.edgehandles( defaults );

      // 节点可改变大小
      cy.nodeResize();
  		cy.on("noderesize.resizestart", function (e, type) {
  			console.log(type);
  		});
  		cy.on("noderesize.resizeend", function (e, type) {
  			document.body.style.cursor = 'initial';
  		});
    },
    loadGraphByJson:function(json){
      json = json.replace(/\n/g,"\\n");
      var sttr = json.substr(json.indexOf("'")+1,json.lastIndexOf("'")-1);
      this.cyInstance.json(JSON.parse(sttr));
      this.cyInstance.json({style:graphConfig.style});
      setTimeout(function(){
        this.cyInstance.elements().qtip(graphConfig.qtipOptions);
      },500);
    },
    getValueFromStr:function(str){
      var start = str.indexOf('(');
      var end = str.indexOf(')');
      return str.substring(start+1,end);
    },
    addOneNode:function (options){ //新增一个节点。
      var imgClass = options.shape?('img_'+options.shape):'img_applications';
      this.cyInstance.add({
          group: "nodes",
          data: { id:options.id,weight: options.width,height:options.height,label:options.value },
          classes:'bottom-center '+imgClass,
          position: { x: options.x, y: options.y }
      });

    },
    addOneEdge:function(opt){
      this.cyInstance.add({
          group: "edges",
          data: { id:opt.source+""+opt.target,source: opt.source,target:opt.target,label:opt.value },
          classes:'textRotation'
      });
      // this.graphLayout("circle");
    },
    graphLayout:function(layoutType){
      var layoutOpt = graphConfig["layout_"+layoutType] || {name:layoutType};
      this.cyInstance.layout(layoutOpt);
    },
    graphZoom:function(zoomType){
			var zoomLevel = this.cyInstance.zoom();
      var newLevel = (zoomType=='zoomIn') ? (zoomLevel+zoomLevel*0.2) : (zoomLevel-zoomLevel*0.2);
      this.cyInstance.zoom(newLevel);
			this.cyInstance.center();
		},
    getGraphJson:function(){
      return "'"+JSON.stringify(this.cyInstance.json())+"'";
    },
    removeSelected:function(){
      this.cyInstance.nodes(":selected").remove();
      this.cyInstance.edges(".edgeSelected").remove();
    },
    dispose:function(){
      // this.portNameDialog.dispose();
      // this.portNameDialog = null;
      $(this.graphContainer).off().remove();
      // clearInterval(this.intervalTimer);
    }

  };
  cxt.cytoscapejsgraph.CytoscapeMainGraph = CytoscapeMainGraph;
})(window);
