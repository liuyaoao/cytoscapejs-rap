package com.weadmin.cytoscapejs_rap;

//import java.awt.List;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Vector;
import java.util.List;

import org.eclipse.rap.json.JsonObject;
import org.eclipse.rap.json.JsonValue;
import org.eclipse.rap.json.JsonArray;
import org.eclipse.swt.SWT;
import org.eclipse.swt.internal.SWTEventListener;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Listener;

import com.cytoscape.util.cyEvent;
import com.cytoscape.util.cyEventObject;
import com.cytoscape.util.cyEventSource.cyIEventListener;

import org.eclipse.swt.events.KeyEvent;
import org.eclipse.swt.events.KeyListener;

@SuppressWarnings("restriction")
public class CytoscapeGraph extends SVWidgetBase {

	public static class CyGraphEvent{
			public static String MOUSE_DOWN = "onMouseDown";
			public static String NODE_SELECT = "onNodeSelect";
			public static String EDGE_SELECT = "onEdgeSelect";
			public static String EDGE_Connect = "onConnect";
			public static String MOUSE_HOVER = "onMouseHover";
			public static String MOUSE_LEAVE = "onMouseLeave";
			public static String CELL_REMOVE = cyEvent.CELLS_REMOVED;
			public static String CELL_MOVED = cyEvent.CELLS_MOVED;
			public static String CELL_RESIZE = cyEvent.CELLS_RESIZED;
			public static String CELL_CONNECT = cyEvent.CELL_CONNECTED;
			public static String CONTENT_COMPLETED = "isCompleted";
			public static String OPEN_GRAPH = "OpenGraph";
		};

	 @SuppressWarnings("unused")
	private static final String REMOTE_TYPE = "cytoscapejsgraph.cytoscapejshandler";
	 private static final long serialVersionUID = -7580109674486263420L;
	 private String tobeSaveJson = "";
	 private List<cyIEventListener>  graphListeners;

	public CytoscapeGraph(Composite parent, int style) {
		super(parent,style);
		graphListeners = new Vector<>();
		this.addKeyListener(new KeyListener() {
			@Override
			public void keyReleased(KeyEvent e) {
				// TODO Auto-generated method stub
			}
			@Override
			public void keyPressed(KeyEvent e) {
				if (e.keyCode == SWT.DEL){
					removeCells();
				}
			}
		});
	}

	public void setJsonTxt(String josnTxt) {
		this.tobeSaveJson = josnTxt;
		remoteObject.set( "jsontxt", josnTxt );
	}
	public String getToBeSaveJson(){
		return tobeSaveJson;
	}
	public void loadGraphByJson(String json){
		JsonObject obj = new JsonObject();
		obj.add("json", json);
		super.callRemoteMethod("loadGraphByJson", obj);
	}
	public void removeCells(){
		super.callRemoteMethod("removeCells", new JsonObject());
	}
	public void graphLayout(String type){
		JsonObject obj = new JsonObject();
		obj.add("type", type);
		super.callRemoteMethod("graphLayout", obj);
	}
	public void graphZoom(String zoomType){
		JsonObject obj = new JsonObject();
		obj.add("type", zoomType);
		super.callRemoteMethod("graphZoom", obj);
	}
	public void toSaveGraphJson(){
		super.callRemoteMethod("toSaveGraphJson", new JsonObject());
	}
	public void insertVertex(String id, String value,double x,double y,double width,double height,String shape){
		JsonObject obj = new JsonObject();
		obj.set("id", id);
		obj.set("value", value);
		obj.set("x", x);
		obj.set("y", y);
		obj.set("width", width);
		obj.set("height", height);
		if (shape!=null){
			obj.set("shape", shape);
		}
		super.callRemoteMethod("addOneNode", obj);
	}

	public void insertEdge(String id,String value,String source,String target){
		JsonObject obj = new JsonObject();
		obj.set("id", id);
		obj.set("value", value);
		obj.set("source", source);
		obj.set("target", target);
		super.callRemoteMethod("addOneEdge", obj);
	}

	String getRemoteId() {
		return remoteObject.getId();
	}

	@Override
	public void addListener( int eventType, Listener listener ) {
		boolean wasListening = isListening( SWT.Selection );
		super.addListener( eventType, listener );
		if( eventType == SWT.Selection && !wasListening ) {
			remoteObject.listen( "Selection", true );
		}
	}

	@Override
	public void removeListener( int eventType, Listener listener ) {
		boolean wasListening = isListening( SWT.Selection );
		super.removeListener( eventType, listener );
		if( eventType == SWT.Selection && wasListening ) {
			if( !isListening( SWT.Selection ) ) {
				remoteObject.listen( "Selection", false );
			}
		}
	}

	@Override
	protected void removeListener( int eventType, SWTEventListener listener ) {
		super.removeListener( eventType, listener );
	}
	@Override
	protected void handleSetProp(JsonObject properties) {
		// JsonValue sizeValue = properties.get( "svgSize" );
		// JsonValue svgtxt = properties.get( "svgTxt" );
    // if( sizeValue != null ) {
    //   String sizeStr = sizeValue.asString();
		// 	JsonObject obj = JsonObject.readFrom(sizeStr);
		// 	this.svgSize = obj;
    // }
		// if( svgtxt != null ) {
		// 	this.svgTxt = svgtxt.asString();
		// }
	}

	@Override
	protected void handleCallMethod(String method, JsonObject parameters) {
		if (method.equals(CyGraphEvent.MOUSE_DOWN)||method.equals(CyGraphEvent.NODE_SELECT)
				||method.equals(CyGraphEvent.EDGE_SELECT)||method.equals(CyGraphEvent.MOUSE_HOVER)
				||method.equals(CyGraphEvent.MOUSE_LEAVE)){
			double x = parameters.get("x").asDouble();
			double y = parameters.get("y").asDouble();
			cyEventObject event = new cyEventObject(method,"x",x,"y",y);
			if (parameters.get("id")!=null){
				event.getProperties().put("id", parameters.get("id").asString());
			}
			if (parameters.get("edge")!=null&&parameters.get("edge").isBoolean()){
				event.getProperties().put("edge", parameters.get("edge").asBoolean());
			}
			invokeCyListener(event);
		}
		if (method.equals(CyGraphEvent.CELL_REMOVE)||method.equals(CyGraphEvent.CELL_MOVED)
				||method.equals(CyGraphEvent.CELL_RESIZE)){
			JsonArray ids = parameters.get("ids").asArray();

			cyEventObject event = new cyEventObject(method,"id",ids);
			invokeCyListener(event);
		}

		if (method.equals(CyGraphEvent.CELL_CONNECT)){
			JsonValue edge = parameters.get("edge");
			String terminal = parameters.get("terminal").asString();
			boolean source = parameters.get("source").asBoolean();

			cyEventObject event = new cyEventObject(method,"edge",edge,"terminal",terminal,"source",source);
			if (parameters.get("previous")!=null){
				String previous = parameters.get("previous").asString();
				event.getProperties().put("previous", previous);
			}
			invokeCyListener(event);
		}
		//TODO
	}

	@Override
	protected void handleCallNotify(String eventName, JsonObject parameters) {
		if ("Selection".equals(eventName)) {
			Event event = new Event();
			event.text = parameters.get("text").asString();
			event.data =  parameters.get("data").asString();
			if(event.text.toLowerCase().equals("tapblank")){
				event.x =  parameters.get("x").asInt();
				event.y =  parameters.get("y").asInt();
			}else if(event.text.toLowerCase().equals("graph_initialized")){
			}else if(event.text.toLowerCase().equals("savegraph")){
			}else if(event.text.toLowerCase().equals("xxxxxxx")){
			}
			notifyListeners(SWT.Selection, event);
		}
	}

	private void invokeCyListener(cyEventObject event){
		for (cyIEventListener l:graphListeners){
			l.invoke(this, event);
		}
	}
	public void addGraphListener(cyIEventListener l){
		graphListeners.add(l);
	}
	@Override
	protected String getWidgetName() {
		return "cytoscapejshandler";
	}
	@Override
	protected ArrayList<CustomRes> getCustomRes() {
		ArrayList<CustomRes> res = new ArrayList<>();
		// images resource
		res.add(new CustomRes("images/earth.png", false, false));
		res.add(new CustomRes("images/application.png", false, false));
		res.add(new CustomRes("images/applications.png", false, false));
		res.add(new CustomRes("images/equipment.png", false, false));
		res.add(new CustomRes("images/server.png", false, false));
		res.add(new CustomRes("images/servers.png", false, false));
		res.add(new CustomRes("images/database.png", false, false));
		res.add(new CustomRes("images/loadbalancing.png", false, false));
		res.add(new CustomRes("images/firewall.png", false, false));
		res.add(new CustomRes("images/middleware.png", false, false));
		res.add(new CustomRes("images/network.png", false, false));
		res.add(new CustomRes("images/storage.png", false, false));
		res.add(new CustomRes("images/website.png", false, false));
		res.add(new CustomRes("images/virtualmachine.png", false, false));
		res.add(new CustomRes("images/wirelessnetwork.png", false, false));
		res.add(new CustomRes("images/mailsystem.png", false, false));
		res.add(new CustomRes("images/computerroomenvironment.png", false, false));
		res.add(new CustomRes("images/error.png", false, false));
		res.add(new CustomRes("images/forbid.png", false, false));
		res.add(new CustomRes("images/good.png", false, false));
		res.add(new CustomRes("images/unconn.png", false, false));
		res.add(new CustomRes("images/warning.png", false, false));

		res.add(new CustomRes("images/down.png", false, false));
		res.add(new CustomRes("images/up.png", false, false));
		res.add(new CustomRes("images/topubg.jpg", false, false));

		// css and js resource.
		res.add(new CustomRes("main.css", true, true));
		res.add(new CustomRes("ui/jquery.qtip.css", true, true));

		res.add(new CustomRes("jquery.js", true, false));
		res.add(new CustomRes("ocanvas.min.js", true, false));
		res.add(new CustomRes("cytoscape.js", true, false));
		// layout extensions
		res.add(new CustomRes("layout/springy.js", true, false));
		res.add(new CustomRes("layout/cytoscape-springy.js", true, false));
		res.add(new CustomRes("layout/arbor.js", true, false));
		res.add(new CustomRes("layout/cytoscape-arbor.js", true, false));
		res.add(new CustomRes("layout/dagre.js", true, false));
		res.add(new CustomRes("layout/cytoscape-dagre.js", true, false));
		res.add(new CustomRes("layout/cytoscape-spread.js", true, false));
		// UI extensions
		res.add(new CustomRes("ui/jquery.qtip.js", true, false));
		res.add(new CustomRes("ui/cytoscape-qtip.js", true, false));

		// custom extensions
		res.add(new CustomRes("cytoscape-edgehandles.js", true, false));
		res.add(new CustomRes("cytoscape-node-resize.js", true, false));
		res.add(new CustomRes("graphConfig.js", true, false));

		res.add(new CustomRes("CytoscapeMainGraph.js", true, false));
		res.add(new CustomRes("handler.js", true, false));
		return res;
	}

}
