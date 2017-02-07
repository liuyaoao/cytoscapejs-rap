
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
      this.graphContainer = null;
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
        _this.initGraph();
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
            _this.addOneNode(cy,{x:event.cyPosition.x,y:event.cyPosition.y});
        } else {
          console.log('tap on some element');
        }
      });
      cy.on('mouseover', 'node', function(evt){
        var node = evt.cyTarget;
        console.log( "mouse over event!!mouseover:" + node.id() );
      });
      cy.on('mouseout', 'node', function(evt){
        var node = evt.cyTarget;
        console.log( "mouse over event:" + node.id() );
      });
    },
    initGraph:function(){
      var cy = cytoscape({
        container: document.getElementById('cytoscapegraph'),

        style: [
        {
          selector: 'node',
          style: {
            'height': 40,
            'width': 40,
            'shape' : 'rectangle',
            'background-color': '#FFF',
            'background-image':'rwt-resources/cytoscapejshandler/images/applications.png',
            // 'selection-box-color':'#932',
            'background-fit':'cover',
            'label': 'data(label)'
          }
        },

        {
          selector: 'edge',
          style: {
            'label': 'data(label)',
            'width': 3,
            'line-color': '#ccc'
          }
        }],
        elements: [
          { data: { label: 'top left' }, classes: 'top-left' },
          { data: { label: 'hgffdgefds' }, classes: 'top-right' }
        ]

      });
      this.cyInstance = cy;
    },
    getValueFromStr:function(str){
      var start = str.indexOf('(');
      var end = str.indexOf(')');
      return str.substring(start+1,end);
    },
    addOneNode:function (cy,position){ //新增一个节点。
      cy.add({
          group: "nodes",
          data: { weight: 75,label:"helloworld" },
          position: { x: position.x, y: position.y }
      });
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
