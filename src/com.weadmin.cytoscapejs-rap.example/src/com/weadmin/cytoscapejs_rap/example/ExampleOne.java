package com.weadmin.cytoscapejs_rap.example;

import java.io.File;
import java.io.IOException;
import java.util.Random;
import org.apache.commons.io.FileUtils;
import org.eclipse.rap.json.JsonObject;
import org.eclipse.rap.rwt.application.AbstractEntryPoint;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Combo;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Menu;
import org.eclipse.swt.widgets.MenuItem;
import org.eclipse.swt.widgets.Shell;

import com.weadmin.cytoscapejs_rap.CytoscapeGraph;

public class ExampleOne extends AbstractEntryPoint{

	private static final long serialVersionUID = 1L;

	@Override
	protected void createContents(Composite parent) {
		parent.setLayout(new GridLayout(3,false));
//		parent.setLayout(null);
		Composite parents = new Composite(parent, SWT.NONE);
		parents.setLayoutData(new GridData(SWT.FILL, SWT.FILL, true, true));
		parents.setLayout(new GridLayout(1, false));

		Composite composite = new Composite(parents, SWT.NONE);
		composite.setLayoutData(new GridData(SWT.FILL, SWT.FILL, true, false));
		composite.setLayout(new GridLayout(5, false));

		Button refreshBtn = new Button(composite, SWT.PUSH);
		refreshBtn.setText("Refresh");
		Button zoomInBtn = new Button(composite, SWT.PUSH);
		zoomInBtn.setText("zoomIn(+)");
		Button zoomOutBtn = new Button(composite, SWT.PUSH);
		zoomOutBtn.setText("zoomOut(-)");
		Button saveModifiedSvgBtn = new Button(composite, SWT.PUSH);
		saveModifiedSvgBtn.setText("save");

		Composite composite2 = new Composite(parents, SWT.NONE);
		composite2.setLayoutData(new GridData(SWT.FILL, SWT.FILL, true, true));
		composite2.setLayout(new GridLayout(1, false));

		CytoscapeGraph cyGraph = new CytoscapeGraph(composite2, SWT.NONE);
//		cyGraph.setBounds(20, 0, 1000, 600);
		cyGraph.setLayoutData(new GridData(GridData.FILL_BOTH));

		cyGraph.addListener(SWT.Selection, new Listener() {
			private static final long serialVersionUID = 1L;
			public void handleEvent(Event event) {
				String eventag = event.text;
				if (eventag.equals("tapblank")) {
					String id = "nodeId_"+getRangeRandomNum(1,99999);
					cyGraph.insertVertex(id,"node",event.x,event.y,40,40,null);
				}else{
					//TODO
				}
			}
		});
		refreshBtn.addSelectionListener(new SelectionAdapter() {
			private static final long serialVersionUID = 1L;
			@Override
			public void widgetSelected(SelectionEvent e) {
				//TODO
			}
		});
		zoomInBtn.addSelectionListener(new SelectionAdapter() { //zoom in (+)
			private static final long serialVersionUID = 1L;
			@Override
			public void widgetSelected(SelectionEvent e) {
				//TODO
			}
		});
		zoomOutBtn.addSelectionListener(new SelectionAdapter() {
			private static final long serialVersionUID = 1L;
			@Override
			public void widgetSelected(SelectionEvent e) {
				//TODO
			}
		});
		saveModifiedSvgBtn.addSelectionListener(new SelectionAdapter() {
			private static final long serialVersionUID = 1L;
			@Override
			public void widgetSelected(SelectionEvent e) {
				//TODO
			}
		});
		Combo layout = new Combo(composite, SWT.DROP_DOWN);
		layout.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false));
		layout.setItems(new String[]{"树型","圆型","堆型","随意","分层类型"});
		layout.setText("选择布局");
		layout.addSelectionListener(new SelectionListener() {
			private static final long serialVersionUID = 1L;
			@Override
			public void widgetSelected(SelectionEvent e) {
				int index = layout.getSelectionIndex();
				switch (index) {
				case 0:
					cyGraph.graphLayout("tree");
					break;
				case 1:
					cyGraph.graphLayout("circle");
					break;
				case 2:
					cyGraph.graphLayout("stack");
					break;
				case 3:
					cyGraph.graphLayout("fast");
					break;
				case 4:
					cyGraph.graphLayout("hierarchical");
					break;
				case 5:
					cyGraph.graphLayout("partition");
					break;
				default:
					break;
				}
			}
			@Override
			public void widgetDefaultSelected(SelectionEvent e) {
				// TODO Auto-generated method stub
			}
		});

	}

	public static String getRandom(int t){
		int i = (int) (Math.random()*t);
		String s = (i<10?"0"+i:i+"");
		return s;
	}
	private int getRangeRandomNum(int min, int max){

		return (new Random().nextInt(max - min) + min);
	}

}
