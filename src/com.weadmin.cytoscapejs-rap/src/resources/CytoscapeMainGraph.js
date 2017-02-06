
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
	    element.style.position = "absolute";
	    element.style.left = "0";
	    element.style.top = "30px";
			element.style.overflow="auto";
      $(this.container).append( element );

      setTimeout(function(){
        _this.addEvent();
        // console.log("init completed!!");
      },10);
    },
    addEvent:function(){
      var _this = this;

    },

    getValueFromStr:function(str){
      var start = str.indexOf('(');
      var end = str.indexOf(')');
      return str.substring(start+1,end);
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
