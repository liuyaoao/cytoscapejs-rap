package com.weadmin.cytoscapejs_rap.example;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
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
	private String graphJson = "";
	private CytoscapeGraph cyGraph = null;
	private String[] nodeImgArr = {"application","applications","server","servers","database","network","website","firewall","equipment","earth"};

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

		cyGraph = new CytoscapeGraph(composite2, SWT.NONE);
//		cyGraph.setBounds(20, 0, 1000, 600);
		cyGraph.setLayoutData(new GridData(GridData.FILL_BOTH));

		cyGraph.addListener(SWT.Selection, new Listener() {
			private static final long serialVersionUID = 1L;
			public void handleEvent(Event event) {
				String eventag = event.text;
				String data = event.data.toString();
				if (eventag.equals("tapblank")) { //click add new node and edge.
					String nodeId = "nodeId_"+getRangeRandomNum(1,99999);
					String edgeId = "edgeId_"+getRangeRandomNum(1,99999);
					int index = getRangeRandomNum(0,9);
					String shapeType = nodeImgArr[index];

					cyGraph.insertVertex(nodeId,"node",event.x,event.y,40,40,shapeType);
					cyGraph.insertEdge(edgeId,"edge_label","node_servers",nodeId);
				}else if(eventag.equals("graph_initialized")){
					getGraphJsonByFileName("json00"); //根据文件名读取初始化的图形数据
					cyGraph.loadGraphByJson(graphJson); //加载渲染出图形
				}else if(eventag.equals("savegraph")){
					try {
						FileUtils.writeStringToFile(new File("D:/liuyaoao/132.txt"), data,"utf-8");
					} catch (IOException e1) {
						e1.printStackTrace();
					}
				}else if(eventag.equals("xxxxxx")){

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
				cyGraph.graphZoom("zoomIn");
			}
		});
		zoomOutBtn.addSelectionListener(new SelectionAdapter() {
			private static final long serialVersionUID = 1L;
			@Override
			public void widgetSelected(SelectionEvent e) {
				cyGraph.graphZoom("zoomOut");
			}
		});
		saveModifiedSvgBtn.addSelectionListener(new SelectionAdapter() {
			private static final long serialVersionUID = 1L;
			@Override
			public void widgetSelected(SelectionEvent e) {
				cyGraph.toSaveGraphJson(); //click save button.
			}
		});
		Combo layout = new Combo(composite, SWT.DROP_DOWN);
		layout.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false));
		layout.setItems(new String[]{"树型","圆型","堆型","随意(arbor)","分层类型","广播扩散","弹性布局","cose布局"});
		layout.setText("选择布局");
		layout.addSelectionListener(new SelectionListener() {
			private static final long serialVersionUID = 1L;
			@Override
			public void widgetSelected(SelectionEvent e) {
				int index = layout.getSelectionIndex();
				switch (index) {
				case 0:
					cyGraph.graphLayout("dagre"); //this is tree layout.
					break;
				case 1:
					cyGraph.graphLayout("circle");
					break;
				case 2:
					cyGraph.graphLayout("concentric");
					break;
				case 3:
					cyGraph.graphLayout("arbor"); //this is random layout.
					break;
				case 4:
					cyGraph.graphLayout("breadthfirst"); // breadthfirst == hierarchical
					break;
				case 5:
					cyGraph.graphLayout("spread");
					break;
				case 6:
					cyGraph.graphLayout("springy");
					break;
				case 7:
					cyGraph.graphLayout("cose");
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


	public void getGraphJsonByFileName(String filename){
//		ClassLoader classLoader = CytoscapeGraph.class.getClassLoader();
		InputStream inputStream = this.getClass().getResourceAsStream("jsons/"+filename+".txt");
		byte bt[] = new byte[5242880]; //最大可放5M大小字节
    int len = 0;
    int temp=0;          //所有读取的内容都使用temp接收
		int startIndex = 0;
    try {
    	while((temp=inputStream.read())!=-1){    //当没有读取完时，继续读取
          bt[len]=(byte)temp;
          len++;
      }
      inputStream.close();
    }catch(IOException ioe){
    	throw new IllegalArgumentException("Failed to load resources", ioe);
    }
    try{
    	graphJson = new String(bt,"UTF-8");
			System.out.println("init graphJson:"+graphJson);
    }catch(UnsupportedEncodingException e){
    	throw new IllegalArgumentException("Failed to load resources", e);
    }
		cyGraph.setJsonTxt(graphJson); //缓存一下读取到的json文本。
	}


	//工具方法。
	public static String getRandom(int t){
		int i = (int) (Math.random()*t);
		String s = (i<10?"0"+i:i+"");
		return s;
	}
	private int getRangeRandomNum(int min, int max){
		return (new Random().nextInt(max - min) + min);
	}

}
