/*****************************
 *date: 2017/02/06
 *auther: yaoao.liu
 *cytoscapejs library on rap
 *******************************/
var DEVICEPANEL_RAP_BASEPATH = "rwt-resources/cytoscapejshandler/";
(function() {
	'use strict';
	if (!window.cytoscapejsgraph) {
		window.cytoscapejsgraph = {};
	}
	rap.registerTypeHandler("cytoscapejsgraph.cytoscapejshandler", {
		factory : function(properties) {
			return new cytoscapejsgraph.cytoscapejshandler(properties);
		},
		destructor : "destroy",
		methods: ["removeCells"],
		properties : ["size"],
		events : ["Selection"]
	});

	cytoscapejsgraph.cytoscapejshandler = function(properties) {
		this._parent = rap.getObject(properties.parent);
		bindAll(this, [ "destroy", "onSend", "onRender", "refreshSize", "updateContainerSize","resizeLayout"]);
		this.element = document.createElement("div");
		this.element.style.position = 'absolute';
		this.element.style.top = '0';
		this.element.style.left = '0';
		this.element.style.width = '100%';
		this.element.style.height = '100%';
		// this.element.style.overflow = 'auto';
		this._parent.append(this.element);
		this._parent.addListener("Resize", this.resizeLayout);
		this.ready = false;
		var area = this._parent.getClientArea();
		this._svgSize = {width:area[2]||300,height:area[3]||300};

		this._uniqueId = Math.random().toString(36).split(".")[1];
		rap.on("render", this.onRender);

	};
	cytoscapejsgraph.cytoscapejshandler.prototype = {
		onRender : function() {
      var _this = this;
			if (this.element.parentNode) {
				rap.off("render", this.onRender);
				// Creates the graph inside the given container
				this.mainGraph = new cytoscapejsgraph.CytoscapeMainGraph({
					container:this.element,
					uniqueId:this._uniqueId
				});
				rap.on("send", this.onSend);
				this.ready = true;
			}
		},
		setSize:function(size){
			this._size = size;
		},
		destroy : function () {
			rap.off("send", this.onSend);
			this.mainGraph && this.mainGraph.dispose();
			(this.element && this.element.parentNode) ? this.element.parentNode.removeChild(this.element): null;
		},
		onSend : function() {
			// rap.getRemoteObject( this ).set( "model", "123456789"); //设置后端的值，还有其他两个方法:call(method,properties):调用后端的方法,notify(event,properties);
			// rap.getRemoteObject( this ).call( "handleCallRefreshData", "123456789"); //设置后端的值，还有其他两个方法:call(method,properties):调用后端的方法,notify(event,properties);
		},
		removeCells:function(){
			//TODO
		},
		// 大小自适应
		resizeLayout : function() {
			if (this.ready) {
				var area = this._parent.getClientArea();
				 this.updateContainerSize();
				// console.log("resizeLayout:",area);
				if(Math.abs(area[2]-this._svgSize.width)<5 && Math.abs(area[3]-this._svgSize.height)<5){ return; }
				// this.refreshSize(area[0],area[1],area[2],area[3]);
			}
		},
		refreshSize:function(obj){
			this._svgSize = {width:obj.width,height:obj.height};
			this.mainGraph.refreshSize(obj.width,obj.height);
		},
		updateContainerSize:function(){
			if(this.element.parentNode){
				$(this.element).width($(this.element.parentNode).width());
				$(this.element).height($(this.element.parentNode).height());
			}
		}
	};
	var bind = function(context, method) {
		return function() {
			return method.apply(context, arguments);
		};
	};
	var bindAll = function(context, methodNames) {
		for (var i = 0; i < methodNames.length; i++) {
			var method = context[methodNames[i]];
			context[methodNames[i]] = bind(context, method);
		}
	};
	var async = function(context, func) {
		window.setTimeout(function() {
			func.apply(context);
		}, 0);
	};
	var randomNumBoth = function(Min,Max){
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.round(Rand * Range); //四舍五入
      return num;
	};

}());
