package com.weadmin.cytoscapejs_rap;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import org.eclipse.rap.json.JsonObject;
import org.eclipse.rap.json.JsonValue;
import org.eclipse.rap.json.JsonArray;
import org.eclipse.swt.SWT;
import org.eclipse.swt.internal.SWTEventListener;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Listener;

@SuppressWarnings("restriction")
public class CytoscapeGraph extends SVWidgetBase {

	 @SuppressWarnings("unused")
	private static final String REMOTE_TYPE = "svgdevicepanel.devicepanelsvgjs";
	 private static final long serialVersionUID = -7580109674486263420L;
	 private String sysObjId = "";
	 private String svgTxt = "";
	 private String svgTxtPrefix = ""; //svg files header,当重新写入svg的时候还要加上的。
	 private JsonObject svgSize = null;
	 private JsonObject statuss;
	 private String menudesc;
	 private JsonObject tooltipdata;
	 private String[] interfaceNameList;

	public CytoscapeGraph(Composite parent, int style) {
		super(parent,style);
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
		JsonValue sizeValue = properties.get( "svgSize" );
		JsonValue svgtxt = properties.get( "svgTxt" );
    if( sizeValue != null ) {
      String sizeStr = sizeValue.asString();
			JsonObject obj = JsonObject.readFrom(sizeStr);
			this.svgSize = obj;
			// System.out.println("svgSize:"+sizeStr);
    }
		if( svgtxt != null ) {
			this.svgTxt = svgtxt.asString();
			// System.out.println("svgTxtChanged!!!");
		}
	}

	@Override
	protected void handleCallMethod(String method, JsonObject parameters) {
		// System.out.println("handleCallMethod :"+method);
	}

	@Override
	protected void handleCallNotify(String eventName, JsonObject parameters) {
		if ("Selection".equals(eventName)) {
			Event event = new Event();
			event.text = parameters.get("index").asString();
			event.data =  parameters.get("data").asString();

			if(event.text.toLowerCase().equals("svgtxtchanged")){
				event.data = this.svgTxtPrefix + parameters.get("data").asString();
			}
			if(event.text.toLowerCase().equals("portmenu") || event.text.toLowerCase().equals("portport")){
				event.x =  parameters.get("x").asInt();
				event.y =  parameters.get("y").asInt();
			}
			notifyListeners(SWT.Selection, event);
		}
	}

	@Override
	protected String getWidgetName() {
		return "cytoscapejshandler";
	}
	@Override
	protected ArrayList<CustomRes> getCustomRes() {
		ArrayList<CustomRes> res = new ArrayList<>();
		res.add(new CustomRes("main.css", true, true));
		res.add(new CustomRes("jquery.js", true, false));
		res.add(new CustomRes("cytoscape.js", true, false));
//		res.add(new CustomRes("menuPanel.js", true, false));
		res.add(new CustomRes("CytoscapeMainGraph.js", true, false));
		res.add(new CustomRes("handler.js", true, false));
		return res;
	}

}
