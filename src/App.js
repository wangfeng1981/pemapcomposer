import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom';
import LayerPanel from './panels/LayerPanel';
import MapItemPanel from './panels/MapItemPanel';
import { Toast, Modal, Button } from 'react-bootstrap';
import { Transition } from 'react-transition-group';
import BoDialogSimple from './dialogs/BoDialogSimple';


import './panels/panels.css';



import { fabric } from "fabric";
import McMainToolbarPanel from './panels/McMainToolbarPanel';
import DialogSimpleOpenfile from './dialogs/DialogSimpleOpenfile';
import DialogMapItemProperty from './dialogs/DialogMapItemProperty';
import DialogLayerProperty from './dialogs/DialogLayerProperty';
import DialogExport from './dialogs/DialogExport';



global.g_version = "v0.1.0";
global.g_version = "v0.1.1";

//192.168.56.103:15911/
global.g_task17apiroot = "http://192.168.56.103:15900/pe/";
global.g_omcApi = "http://192.168.56.103:15911/";

//http://192.168.56.103:15980/omc_res/firefox.png 静态资源网址样例
global.g_staticRootUrl = "http://192.168.56.103:15980/";

//A4 297x210mm x4     1188x840px  , dpi72 841x595
//A4 Portait   x2.83  595x841px     dpi72 595x841 
global.g_dpi72toCanvas = 1.4126; //水平 1.4126   垂直1.00
global.g_canvasPx2A4mm = 297.0 / 1188.0;  //水平 297/1188    垂直 210/595 
global.g_pagedirection = 'h';

//debug test file  ?file=omc_out/20220416/095446-7188.qgs

global.g_mapClipRectObject = null;
global.g_mapInnerContentChanged = false;



function App() {
	//每次zoomIn zoomOut extent的变化大小
	const theZoomScale = 0.25;

	const [projectQgsFile, setProjectQgsFile] = useState('');
	const [fabricCanvasH, setFabricCanvasH] = useState(null);
	const [fabricCanvasV, setFabricCanvasV] = useState(null);
	const [layoutItemArry, setLayoutItemArry] = useState([]);
	const [layerArray, setLayerArray] = useState([]);
	const [projectObject, setProjectObject] = useState(null);
	const [errorMsgArray, setErrorMsgArray] = useState([]);
	const [olMapExtentX0, setOlMapExtentX0] = useState(-180);
	const [olMapExtentX1, setOlMapExtentX1] = useState(180);
	const [olMapExtentY0, setOlMapExtentY0] = useState(-90);
	const [olMapExtentY1, setOlMapExtentY1] = useState(90);
	const [theUid, setTheUid] = useState(0);
	const [isDialogOpenfileOpen, setIsDialogOpenfileOpen] = useState(false);
	const [dialogOpenfileType, setDialogOpenfileType] = useState(0);
	const [isDlgMapItemPptOpen, setIsDlgMapItemPptOpen] = useState(false);
	const [isDlgLayerPptOpen, setIsDlgLayerPptOpen] = useState(false);
	const [selectedLayerObject, setSelectedLayerObject] = useState(null);
	const [selectedLayoutObject, setSelectedLayoutObject] = useState(null);
	const [currentPageDirection, setCurrentPageDirection] = useState('h');//h(landscape) or v(portait)
	const [canvasHStyle, setCanvasHStyle] = useState({display:"block"}) ;
	const [canvasVStyle, setCanvasVStyle] = useState({display:"none"}) ;
	const [isDialogExportOpen, setIsDialogExportOpen] = useState(false) ;


	useEffect(() => {
		/// 从当前Url中解析出file字段参数，作为服务器端的qgsfile，然后保存到this.state中
		let urlParams = new URLSearchParams(window.location.search);
		const tprojectQgsFile = urlParams.get('file');
		if (typeof urlParams.get("x0") !== 'undefined') setOlMapExtentX0(parseFloat(urlParams.get('x0')));
		if (typeof urlParams.get("x1") !== 'undefined') setOlMapExtentX1(parseFloat(urlParams.get('x1')));
		if (typeof urlParams.get("y0") !== 'undefined') setOlMapExtentY0(parseFloat(urlParams.get('y0')));
		if (typeof urlParams.get("y1") !== 'undefined') setOlMapExtentY1(parseFloat(urlParams.get('y1')));
		if (typeof urlParams.get("uid") !== 'undefined') setTheUid(urlParams.get("uid"));

		if (typeof tprojectQgsFile !== 'undefined' && tprojectQgsFile !== null && tprojectQgsFile !== '') {
			console.log("debug 2");
			setProjectQgsFile(tprojectQgsFile);
		}
		var canvas1 = new fabric.Canvas('fabricCanvasH');
		setFabricCanvasH(canvas1, {
			backgroundColor: 'rgba(255,255,255,1)',
			selectionColor: 'blue',
			selectionLineWidth: 2
		});

		var canvas2 = new fabric.Canvas('fabricCanvasV');
		setFabricCanvasV(canvas2, {
			backgroundColor: 'rgba(255,255,255,1)',
			selectionColor: 'blue',
			selectionLineWidth: 2
		});

	}, []);


	/// Qgs文件更新，自动重绘canvas
	useEffect(() => {
		if (typeof projectQgsFile !== 'undefined' && projectQgsFile !== null && projectQgsFile !== '') {
			//刷新绘图区
			regenerateProjectPartsAndRedrawCanvas();
		}
	}, [projectQgsFile])


	/// 切换页面方向
	const helperChangePageDirection = function (newdir) {
		if (newdir !== global.g_pagedirection) {

			let jsondata = {
				file: projectQgsFile,
				dir: newdir
			};
			callOmcRpc("layout.setpage", jsondata, function (res) {

				global.g_pagedirection = newdir;
				//A4 297x210mm x4     1188x840px  , dpi72 841x595
				//A4 Portait   x2.83  595x841px     dpi72 595x841 
				if (newdir === 'h') {

					global.g_dpi72toCanvas = 1.4126; //水平 1.4126   垂直1.00
					global.g_canvasPx2A4mm = 297.0 / 1188.0;//水平 297/1188    垂直 210/595 
					setCanvasHStyle({display:"block"}) ;
					setCanvasVStyle({display:"none"}) ;
					setCurrentPageDirection(newdir);

				} else {
					setCanvasHStyle({display:"none"}) ;
					setCanvasVStyle({display:"block"}) ;
					global.g_dpi72toCanvas = 1.0; //水平 1.4126   垂直1.00
					global.g_canvasPx2A4mm = 210.0 / 595.0;//水平 297/1188    垂直 210/595 

					setCurrentPageDirection(newdir);
				}



				//刷新绘图区
				regenerateProjectPartsAndRedrawCanvas();
			}, function (err) {
				appendErrorMsg(err);
			});

		}

	}




	/// succfunc(resultJsonObj)
	/// failfunc(errorStr)
	const callOmcRpc = function (method, jsondataObj, succfunc, failfunc) {
		const formData = new FormData();
		formData.append('method', method);
		formData.append('data', JSON.stringify(jsondataObj));
		const url1 = global.g_omcApi;
		fetch(
			url1,
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				if (result.state === 0) {
					//good
					succfunc(result);
				} else {
					//bad
					failfunc(result.message);
				}
			})
			.catch(err => {
				failfunc(err);
			});
	}

	/// 从layoutitemArray中查找MapItem对象数组
	const helperFindMapItems = function () {
		let mapitems = [];
		layoutItemArry.forEach(item => {
			if (item.layoutitem.loitype === 'map') {
				mapitems.push(item);
			}
		});
		return mapitems;
	}


	/// 从fabric objects 查找uuid的对象
	const helperFindFabricObject = function (uuid1) {
		let theObj1 = null;
		if( global.g_pagedirection==='h'){
			fabricCanvasH.forEachObject(function (fobj1, index1) {
				if (fobj1.uuid === uuid1) {
					theObj1 = fobj1;
				}
			});
		}else{
			fabricCanvasV.forEachObject(function (fobj1, index1) {
				if (fobj1.uuid === uuid1) {
					theObj1 = fobj1;
				}
			});
		}
		
		return theObj1;
	}



	const onAddVecLayer = function () {
		setDialogOpenfileType(3);
		setIsDialogOpenfileOpen(true);
	}



	// 画布对象鼠标抬起事件 
	const onFabricObjectMouseUp = function (ev) {
		console.log("mouseup");

		let newleft = ev.target.left * global.g_canvasPx2A4mm;
		let newtop = ev.target.top * global.g_canvasPx2A4mm;
		let theuuid = ev.target.uuid;

		let action = ev.transform.action;

		if (action === 'drag') {
			let tdata = {
				left: newleft,
				top: newtop, uuid: theuuid, file: projectQgsFile
			};
			callOmcRpc("item.move", tdata,
				function (res) {
					//对象移动不用重新绘图，只需要将移动信息写入后台qgsfile即可
				},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});
		}
		else if (action === 'scale' || action === 'scaleY' || action === 'scaleX') {
			let heightnew = ev.target.height * ev.target.scaleY;
			let widthnew = ev.target.width * ev.target.scaleX;

			if (ev.target.loitype === 'map') {
				//保持地图图片在左上角对齐，只改变长宽，不改变内容尺寸
				ev.target.scaleX = global.g_dpi72toCanvas;
				ev.target.scaleY = global.g_dpi72toCanvas;
				ev.target.width = widthnew / global.g_dpi72toCanvas;
				ev.target.height = heightnew / global.g_dpi72toCanvas;
			}

			let tdata = {
				uuid: theuuid, file: projectQgsFile,
				width: widthnew * global.g_canvasPx2A4mm,
				height: heightnew * global.g_canvasPx2A4mm
			};

			callOmcRpc("item.resize", tdata,
				function (res) {
					regenerateProjectPartsAndRedrawCanvas();
				},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});

		}

	}



	// 清空画布，重新从projectjson读取数据，重新绘制画布
	const redrawMapComposerCanvas = function (itemArray) {
		//fabricCanvas
		fabricCanvasH.clear();
		fabricCanvasV.clear() ;

		let itemcount = itemArray.length;
		let oImgArray = [];

		let uuidFromBigZtoSmallZ = [] ;
		for(let i = 0 ; i < itemcount ; ++ i ){
			uuidFromBigZtoSmallZ.push( itemArray[i].layoutitem.uuid ) ;
		}

		itemArray.forEach(function (item) {

			const pngurl = global.g_staticRootUrl + item.png;
			fabric.Image.fromURL(pngurl, function (oImg) {
				--itemcount;
				oImg.scaleX = global.g_dpi72toCanvas;
				oImg.scaleY = global.g_dpi72toCanvas;
				oImg.left = item.layoutitem.left / global.g_canvasPx2A4mm;
				oImg.top = item.layoutitem.top / global.g_canvasPx2A4mm;
				oImg.on('mouseup', onFabricObjectMouseUp);
				oImg.uuid = item.layoutitem.uuid;
				oImg.loitype = item.layoutitem.loitype;
				//oImg.moveTo( item.layoutitem.z ) ;
				oImg.setCoords();
				oImg.z = item.layoutitem.z;
				if (item.layoutitem.loitype === 'north') {
					//指北针 地图 不能旋转
					oImg["lockRotation"] = true;
				}
				if (item.layoutitem.loitype === 'map') {
					oImg["lockRotation"] = true;

				}
				oImg['lockRotation'] = true;
				oImg['lockScalingFlip'] = true;
				oImg['lockSkewingX'] = true;
				oImg['lockSkewingY'] = true;

				oImgArray.push(oImg) ;
				if (itemcount === 0) {
					console.log('refresh...');
					for (let i = uuidFromBigZtoSmallZ.length-1; i >=0 ; --i) {
						
						for(let j = 0 ; j < oImgArray.length; ++ j ){
							if( oImgArray[j].uuid === uuidFromBigZtoSmallZ[i] ){
								if( global.g_pagedirection==='h')
								{
									fabricCanvasH.add(oImgArray[j]);
								}	
								else{
									fabricCanvasV.add(oImgArray[j]);
								}
							}
						}
					}
					fabricCanvasH.requestRenderAll();
					fabricCanvasV.requestRenderAll();
				}
			});

		});
	}


	//请求后端重新生成渲染project的文件
	const regenerateProjectPartsAndRedrawCanvas = function () {
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.dpi = 72;
		callOmcRpc("project.export", jsondata,
			function (res) {
				reloadOmcProjectParts(res.data.projfile);
			},
			function (err) {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}



	//从json加载整个作图工程
	const reloadOmcProjectParts = function (projJsonFile) {

		let url = global.g_staticRootUrl + projJsonFile;
		fetch(url)  //GET
			.then(response => response.json())
			.then(result => {
				console.log("proj-json-file:");
				console.log(result);

				setProjectObject(result);
				if (result.page.dir !== global.g_pagedirection) {
					helperChangePageDirection(result.page.dir);
				}

				//更新canvas
				const itemarr = result.loitem_array;
				setLayoutItemArry(itemarr);

				const tlayerarray = result.layer_array;
				setLayerArray(tlayerarray);

				redrawMapComposerCanvas(itemarr);

			}).catch(err => {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}








	///////////////////////////////// main tool bar

	const onMTBOpen = function () {
		console.log("onMTBOpen");
		setDialogOpenfileType(1);
		setIsDialogOpenfileOpen(true);
	}


	const onMTBRefresh = function () {
		regenerateProjectPartsAndRedrawCanvas();
		//reloadOmcProject() ;
	}

	const onMTBExport = function () {
		setIsDialogExportOpen(true) ;
	}


	const onMTBAddMap = function () {
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.x0 = olMapExtentX0;
		jsondata.x1 = olMapExtentX1;
		jsondata.y0 = olMapExtentY0;
		jsondata.y1 = olMapExtentY1;
		callOmcRpc("layout.addmap", jsondata,
			function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas() ;
			},
			function (err) {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}

	const onMTBAddLabel = function () {
		let jsondata = {};
		jsondata.text = "Please edit text...";
		jsondata.file = projectQgsFile;
		callOmcRpc("layout.addlabel", jsondata,
			function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas() ;
			},
			function (err) {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}


	const onMTBAddRect = function () {
		let jsondata = {};
		jsondata.file = projectQgsFile;
		callOmcRpc("layout.addrect", jsondata,
			function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas() ;
			},
			function (err) {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}


	const onMTBAddEll = function () {
		let jsondata = {};
		jsondata.file = projectQgsFile;
		callOmcRpc("layout.addell", jsondata,
			function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas() ;
			},
			function (err) {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}

	const onMTBAddArrow = function () {
		let jsondata = {};
		jsondata.file = projectQgsFile;
		callOmcRpc("layout.addarrow", jsondata,
			function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas() ;
			},
			function (err) {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}

	/// 指北针不能旋转角度
	const onMTBAddNorth = function () {
		const mapitems = helperFindMapItems();
		if (mapitems.length > 0) {
			let jsondata = {};
			jsondata.mapuuid = mapitems[0].layoutitem.uuid;
			jsondata.file = projectQgsFile;
			callOmcRpc("layout.addnorth", jsondata,
				function (res) {
					//good
					regenerateProjectPartsAndRedrawCanvas() ;
				},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});
		}
	}

	const onMTBAddScalebar = function () {
		const mapitems = helperFindMapItems();
		if (mapitems.length > 0) {
			let jsondata = {};
			jsondata.mapuuid = mapitems[0].layoutitem.uuid;
			jsondata.file = projectQgsFile;
			callOmcRpc("layout.addscalebar", jsondata,
				function (res) {
					//good
					regenerateProjectPartsAndRedrawCanvas() ;
				},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});
		} else {
			appendErrorMsg("没有地图元素，请先添加地图.");
		}
	}

	const onMTBAddLegend = function () {
		const mapitems = helperFindMapItems();
		if (mapitems.length > 0) {
			let jsondata = {};
			jsondata.mapuuid = mapitems[0].layoutitem.uuid;
			jsondata.file = projectQgsFile;
			callOmcRpc("layout.addlegend", jsondata,
				function (res) {
					//good
					regenerateProjectPartsAndRedrawCanvas() ;
				},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});
		} else {
			appendErrorMsg("没有地图元素，请先添加地图.");
		}
	}

	const onMTBAddImage = function () {
		setDialogOpenfileType(2);
		setIsDialogOpenfileOpen(true);
	}

	// v/h
	const onMTBPageDirection = function (vOrH) {
		//vOrH is 'v' or 'h'
		helperChangePageDirection(vOrH);
	}

	const onMTBQuit = function () {

	}

	const appendErrorMsg = function (err) {
		setErrorMsgArray([...errorMsgArray, err]);
	}



	///////////////////////////////// main tool bar end

	//辅助函数 加锁或者解锁layout元素
	const helperSetLockAllFabric = function (isLock) {
		if( global.g_pagedirection==='h'){
			fabricCanvasH.forEachObject(function (fobj1, index1) {
				fobj1.lockMovementX = isLock;
				fobj1.lockMovementY = isLock;
				fobj1.lockScalingX = isLock;
				fobj1.lockScalingY = isLock;
			});
		}else{
			fabricCanvasV.forEachObject(function (fobj1, index1) {
				fobj1.lockMovementX = isLock;
				fobj1.lockMovementY = isLock;
				fobj1.lockScalingX = isLock;
				fobj1.lockScalingY = isLock;
			});
		}
		
	}


	//鼠标抬起事件，当移动地图内部内容
	const onMapItemInnerMouseupHandler = function (ev) {
		console.log("new mouseup");
		global.g_mapInnerContentChanged = true;

		const map1 = ev.target;
		const cp1 = map1.clipPath;
		const rect1 = global.g_mapClipRectObject;

		cp1.left = rect1.left + 2;
		cp1.top = rect1.top + 2;
		map1.set('dirty', true);

	}

	//点击地图元素移动内部内容按钮
	const onLayoutItemMapStartMoveInner = function (item) {
		let map1 = helperFindFabricObject(item.layoutitem.uuid);
		if (map1 === null) {
			console.log("no find " + item.layoutitem.uuid);
			return;
		}

		var rect = new fabric.Rect({
			left: map1.left - 2,
			top: map1.top - 2,
			width: map1.width,
			height: map1.height,
			fill: '',
			objectCaching: false,
			stroke: 'gray',
			strokeWidth: 4,
			scaleX: global.g_dpi72toCanvas,
			scaleY: global.g_dpi72toCanvas,
		});

		const oMapCenterPoint = map1.getCenterPoint();

		var clipPath2 = new fabric.Rect({
			left: rect.left + 2,
			top: rect.top + 2,
			width: map1.width,
			height: map1.height,
			absolutePositioned: true,
			scaleX: global.g_dpi72toCanvas,
			scaleY: global.g_dpi72toCanvas,
		});

		global.g_mapClipRectObject = rect;
		if( global.g_pagedirection==='h') fabricCanvasH.add(rect);
		else  fabricCanvasV.add(rect);
		map1.clipPath = clipPath2;
		map1.__eventListeners['mouseup'] = [];
		map1.on("mouseup", onMapItemInnerMouseupHandler);
		map1.set('dirty', true);
		if( global.g_pagedirection==='h') fabricCanvasH.setActiveObject(map1);
		else  fabricCanvasV.setActiveObject(map1);
		

		helperSetLockAllFabric(true);
		map1.lockMovementX = false;
		map1.lockMovementY = false;
	}

	//点击地图元素停止移动内部内容按钮
	const onLayoutItemMapEndMoveInner = function (item) {
		const leftr = global.g_mapClipRectObject.left;
		const topr = global.g_mapClipRectObject.top;
		if( global.g_pagedirection==='h')
				fabricCanvasH.remove(global.g_mapClipRectObject);
				else fabricCanvasV.remove(global.g_mapClipRectObject);
		global.g_mapClipRectObject = null;

		let map1 = helperFindFabricObject(item.layoutitem.uuid);
		if (map1 === null) {
			console.log("no find " + item.layoutitem.uuid);
			return;
		}
		const leftm = map1.left;
		const topm = map1.top;
		const extent1 = item.data.extent;

		const widthPx = map1.width * global.g_dpi72toCanvas;
		const widthll = extent1.xmax - extent1.xmin;

		const dxll = (leftm - leftr) * widthll / widthPx;
		const dyll = (topm - topr) * widthll / widthPx;

		map1.__eventListeners['mouseup'] = [];
		map1.on("mouseup", onFabricObjectMouseUp);

		if (global.g_mapInnerContentChanged === false) {
			helperSetLockAllFabric(false);
			map1.clipPath = null;
			return;
		}
		global.g_mapInnerContentChanged = false;

		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.mapuuid = item.layoutitem.uuid;
		jsondata.xmin = extent1.xmin - dxll;
		jsondata.xmax = extent1.xmax - dxll;
		jsondata.ymin = extent1.ymin + dyll;//Y方向坐标相对X是负的，所以这里使用+
		jsondata.ymax = extent1.ymax + dyll;

		callOmcRpc("map.setextent", jsondata,
			function (res) {
				//ok
				helperSetLockAllFabric(false);
				map1.clipPath = null;
				regenerateProjectPartsAndRedrawCanvas() ;
			}, function (err) {
				helperSetLockAllFabric(false);
				appendErrorMsg(err);
				map1.clipPath = null;
			});
	}


	//点击按钮 layout元素编辑按钮
	const onLayoutItemEdit = function (loitem) {
		setSelectedLayoutObject(loitem);
		setIsDlgMapItemPptOpen(true);
	}

	const onLayoutItemDelete = function (loitem) {
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.uuid = loitem.layoutitem.uuid;

		callOmcRpc("layout.deleteitem", jsondata,
			function (res) {
				//ok 在fabric中删除对象，不用刷新界面
				const tfaobj = helperFindFabricObject(loitem.layoutitem.uuid);
				if( global.g_pagedirection==='h')
					fabricCanvasH.remove(tfaobj);
				else fabricCanvasV.remove(tfaobj);

				//从layoutitem面板删除item
				let newItemArr = layoutItemArry.filter(item1 => item1.layoutitem.uuid!==loitem.layoutitem.uuid ) ;
				setLayoutItemArry(newItemArr) ;

			}, function (err) {
				appendErrorMsg(err);
			});

	}





	//关闭错误信息
	const onToastClose = function (tindex) {
		let newErrArr = errorMsgArray.filter(
			(val, index, arr) => { return tindex !== index; }
		)
		setErrorMsgArray(newErrArr);
	}


	//打开文件对话框 start ////////////////////////////////
	const onDialogOpenFileOk = function (filetype, relfilename, nameOrEmpty) {
		if (filetype === 1) {
			setProjectQgsFile(relfilename);
		} else if (filetype === 2) {
			let jsondata = {};
			jsondata.file = projectQgsFile;
			jsondata.relsrc = relfilename;
			callOmcRpc("layout.addimage", jsondata, function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas() ;
			},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});
		} else if (filetype == 3) {
			let jsondata = {};
			jsondata.file = projectQgsFile;
			jsondata.vecname = nameOrEmpty;
			jsondata.vecfile = relfilename;
			callOmcRpc("project.addvec", jsondata, function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas() ;
			},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});
		}
		setIsDialogOpenfileOpen(false);
	}
	const onDialogOpenFileCancel = function () {
		setIsDialogOpenfileOpen(false);
	}


	// END //////////////////////////////////////////////








	// LayoutItemMap 按钮事件 START //////////////////////////////////////////////
	// LayoutItemMap 按钮事件 START //////////////////////////////////////////////
	const computeExtentByScale = function (extent0, scale) {
		let wid = extent0.xmax - extent0.xmin;
		let hei = extent0.ymax - extent0.ymin;
		let cx = extent0.xmin + wid / 2;
		let cy = extent0.ymin + hei / 2;
		let wid1 = wid * scale;
		let hei1 = hei * scale;
		let extent1 = {};
		extent1.xmin = cx - wid1 / 2;
		extent1.xmax = cx + wid1 / 2;
		extent1.ymin = cy - hei1 / 2;
		extent1.ymax = cy + hei1 / 2;
		return extent1;
	}
	const onMapItemZoomIn = function (loitem) {
		let oldextent = loitem.data.extent;
		let scale1 = 1.0 - theZoomScale;
		const extent1 = computeExtentByScale(oldextent, scale1);
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.mapuuid = loitem.layoutitem.uuid;
		jsondata.xmin = extent1.xmin;
		jsondata.xmax = extent1.xmax;
		jsondata.ymin = extent1.ymin;
		jsondata.ymax = extent1.ymax;
		callOmcRpc("map.setextent", jsondata,
			function (res) {
				//ok
				regenerateProjectPartsAndRedrawCanvas();
			}, function (err) {
				appendErrorMsg(err);
			});

	}
	const onMapItemZoomOut = function (loitem) {
		let oldextent = loitem.data.extent;
		let scale1 = 1.0 + theZoomScale;
		const extent1 = computeExtentByScale(oldextent, scale1);
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.mapuuid = loitem.layoutitem.uuid;
		jsondata.xmin = extent1.xmin;
		jsondata.xmax = extent1.xmax;
		jsondata.ymin = extent1.ymin;
		jsondata.ymax = extent1.ymax;
		callOmcRpc("map.setextent", jsondata,
			function (res) {
				//ok
				regenerateProjectPartsAndRedrawCanvas();
			}, function (err) {
				appendErrorMsg(err);
			});
	}

	// LayoutItemMap 按钮事件 END //////////////////////////////////////////////






	// 图层单元格按钮事件 START //////////////////////////////////////////////
	// 图层单元格按钮事件 START //////////////////////////////////////////////
	const onEditLayer = function (lyrItem) {
		setSelectedLayerObject(lyrItem);
		setIsDlgLayerPptOpen(true);
	}

	const onRemoveLayer = function (lyrItem) {
		const lyrid = lyrItem.qlyrid;
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.lyrid = lyrid;
		callOmcRpc("project.deletelayer", jsondata,
			function (res) {
				//ok
				regenerateProjectPartsAndRedrawCanvas();
			}, function (err) {
				appendErrorMsg(err);
			});
	}

	// 图层单元格按钮事件 END //////////////////////////////////////////////








	// 地图要素属性对话框 START //////////////////////////////////////////////
	// 地图要素属性对话框 START //////////////////////////////////////////////
	const onDlgMapItemPptOk = function () {

		setIsDlgMapItemPptOpen(false);
		setSelectedLayoutObject(null);
	}

	const onDlgMapItemPptCancel = function () {
		setIsDlgMapItemPptOpen(false);
		setSelectedLayoutObject(null);
	}



	// 地图要素属性对话框 END //////////////////////////////////////////////







	// 图层属性对话框 START //////////////////////////////////////////////
	// 图层属性对话框 START //////////////////////////////////////////////
	const onDlgLayerPptOk = function () {
		setIsDlgLayerPptOpen(false);
		setSelectedLayerObject(null);
	}

	const onDlgLayerPptCancel = function () {
		setIsDlgLayerPptOpen(false);
		setSelectedLayerObject(null);
	}


	// 图层属性对话框 END //////////////////////////////////////////////




	//  导出作图对话框  START +++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//  导出作图对话框  START +++++++++++++++++++++++++++++++++++++++++++++++++++++++
	const onDialogExportOk = function(data){

		setIsDialogExportOpen(false) ;
	}

	const onDialogExportCancel = function (){
		setIsDialogExportOpen(false) ;
	}

	//  导出作图对话框 END  ---------------------------------------------------------







	//
	//
	//
	return (
		<div className="App" >
			<div className="AppContainer">

				{/* 顶部工具栏 */}
				<McMainToolbarPanel
					onOpen={onMTBOpen}
					onAddVecLayer={onAddVecLayer}
					onAddRect={onMTBAddRect}
					onExport={onMTBExport}
					onRefresh={onMTBRefresh}
					onAddMap={onMTBAddMap}
					onAddLabel={onMTBAddLabel}
					onAddEll={onMTBAddEll}
					onAddArrow={onMTBAddArrow}
					onAddNorth={onMTBAddNorth}
					onAddScalebar={onMTBAddScalebar}
					onAddLegend={onMTBAddLegend}
					onAddImage={onMTBAddImage}
					onPageDirection={onMTBPageDirection}
					onQuit={onMTBQuit}
					currentPageDirection={currentPageDirection}

				/>

				<div style={{ position: 'absolute', top: '58px', width: '100%' }}>
					{/* 图层面板 */}
					<LayerPanel
						onEditItem={onEditLayer}
						onRemoveItem={onRemoveLayer}
						layerArray={layerArray}

					/>





					{/* 地图元素面板 */}
					<MapItemPanel
						layoutItemArry={layoutItemArry}
						onLayoutItemEdit={onLayoutItemEdit}
						onLayoutItemDelete={onLayoutItemDelete}
						onMapItemEnableInner={onLayoutItemMapStartMoveInner}
						onMapItemDisableInner={onLayoutItemMapEndMoveInner}
						onMapItemZoomIn={onMapItemZoomIn}
						onMapItemZoomOut={onMapItemZoomOut}

					/>


					{/* 绘图区域 */}
					<div
						className="AppCanvasContainer"
					>
						<div className="AppCanvasContainerInnerHori" 
						style={canvasHStyle}
						>
							<canvas id="fabricCanvasH" width={1188} height={840}></canvas>
						</div>
						
						<div className="AppCanvasContainerInnerVert"
						style={canvasVStyle}
						>
							<canvas id="fabricCanvasV" width={595} height={841}></canvas>
						</div>
					</div>

				</div>

			</div>




			<div style={{ position: 'absolute', top: '0px', right: '0px' }}>
				{
					errorMsgArray.map((item, index) => (
						<Toast bg='light'
							delay={5000} autohide animation={true}
							key={'key' + index} onClose={() => onToastClose(index)}
						>
							<Toast.Header>
								<strong className="me-auto">出错了</strong>
							</Toast.Header>
							<Toast.Body style={{ backgroundColor: '#FFFBE5' }}>{item}</Toast.Body>
						</Toast>
					))
				}

			</div>

			{/* 打开文件对话框 */}
			<DialogSimpleOpenfile
				isOpen={isDialogOpenfileOpen}
				onCancel={onDialogOpenFileCancel}
				onOk={onDialogOpenFileOk}
				type={dialogOpenfileType}
				uid={theUid}
				appendErrorMsg={appendErrorMsg}
			/>

			{/* 制图元素属性编辑对话框 */}
			<DialogMapItemProperty
				isOpen={isDlgMapItemPptOpen}
				onCancel={onDlgMapItemPptCancel}
				onOk={onDlgMapItemPptOk}
				theObject={selectedLayoutObject}
				projectQgsFile={projectQgsFile}
				callOmcRpc={callOmcRpc}
				appendErrorMsg={appendErrorMsg}
				regenerateProjectPartsAndRedrawCanvas={regenerateProjectPartsAndRedrawCanvas}
			/>


			{/* 图层元素属性编辑对话框 */}
			<DialogLayerProperty
				isOpen={isDlgLayerPptOpen}
				onCancel={onDlgLayerPptCancel}
				onOk={onDlgLayerPptOk}
				theObject={selectedLayerObject}
				projectQgsFile={projectQgsFile}
				callOmcRpc={callOmcRpc}
				appendErrorMsg={appendErrorMsg}
				regenerateProjectPartsAndRedrawCanvas={regenerateProjectPartsAndRedrawCanvas}
			/>



			{/* 导出作图对话框 */}
			<DialogExport 
			isOpen={isDialogExportOpen}
			onCancel={onDialogExportCancel}
			onOk = {onDialogExportOk}
			projectQgsFile={projectQgsFile}
			callOmcRpc={callOmcRpc}
			appendErrorMsg={appendErrorMsg}
			/>
		</div>
	);
}

export default App;
