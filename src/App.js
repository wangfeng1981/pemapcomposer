import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect , useRef } from 'react'
import * as ReactDOM from 'react-dom';
import LayerPanel from './panels/LayerPanel';
import MapItemPanel from './panels/MapItemPanel';
import { Toast, Modal, Button } from 'react-bootstrap';
import { Transition } from 'react-transition-group';
import BoDialogSimple from './dialogs/BoDialogSimple';
import DialogSelectRoiNoDraw from './dialogs/DialogSelectRoiNoDraw';

import './panels/panels.css';



import { fabric } from "fabric";
import McMainToolbarPanel from './panels/McMainToolbarPanel';
import DialogSimpleOpenfile from './dialogs/DialogSimpleOpenfile';
import DialogMapItemProperty from './dialogs/DialogMapItemProperty';
import DialogLayerProperty from './dialogs/DialogLayerProperty';
import DialogExport from './dialogs/DialogExport';

// global.g_version = "v0.1.0";
// global.g_version = "v0.1.1";//2022-4-25
// global.g_version = "v0.1.1tx";// 2022-4-25
// global.g_version = "v0.1.2";// 2022-4-26 map crs 
// global.g_version = "v0.1.2r-qh";//2022-4-26
// global.g_version = "v0.1.3r"; //2022-4-27 fix mapitem resize with grid
// global.g_version = "v0.1.3r-qh";
// global.g_version = "v0.1.4r-qh";
// global.g_version = "v0.1.4r-tx";
// global.g_version = "v0.1.5.0"; //2022-5-31 style legend and map theme, commit
// global.g_version = "v0.1.5.r"; //2022-6-9

//左右侧边栏增加滚动条
//global.g_version = "v0.1.6.0"; //2022-7-8
//global.g_version = "v0.1.6.0-qh"; //2022-7-15
//global.g_version = "v0.1.6.0-wx"; //2022-7-20

//0.图层叠放次序 not start
//0.地图元素叠放次序 not start
//0.地图元素delete按键删除 not start
//0.矢量可访问系统矢量 not start
//0.Label增加对齐选项 not start
//0.分开Qgis图例和pe图例，pe图例编辑，方向，box宽度，box高度，列数，字体，字色，边框  not start
//0.地图内部移动后更新 not
//0.zoom bug not
global.g_version = "v1.0.0.4d"; //2022-9-14



// API 样例 192.168.56.103:15911/
// http://192.168.56.103:15980/omc_res/firefox.png 静态资源网址样例
global.g_task17apiroot = "http://192.168.56.103:15900/pe/";
global.g_omcApi = "http://192.168.56.103:15911/";
global.g_staticRootUrl = "http://192.168.56.103:15980/";

//tencent cloud 
//omc api http://124.220.3.186:15911/
//task17 api http://124.220.3.186:8080/api/pe/user/login
//static res http://124.220.3.186:8080/images/login_inner_frame.png
// global.g_task17apiroot = "http://124.220.3.186:8080/api/pe/";
// global.g_omcApi = "http://124.220.3.186:8080/api/omc/";
// global.g_staticRootUrl = "http://124.220.3.186:8080/" ;

//气候中心 use 8280 as front-function
// global.g_task17apiroot = "http://10.10.30.81:8180/api/pe/";
// global.g_omcApi =        "http://10.10.30.81:15911/";
// global.g_staticRootUrl = "http://10.10.30.81:8180/" ;

//卫星中心 wx
// global.g_task17apiroot = "http://192.168.56.101:8180/api/pe/";
// global.g_omcApi =        "http://192.168.56.101:15911/";
// global.g_staticRootUrl = "http://192.168.56.101:8180/" ;


//for component from peworkbench
global.g_serverAPIRoot=global.g_task17apiroot;
//A4 297x210mm x4     1188x840px  , dpi72 841x595
//A4 Portait   x2.83  595x841px     dpi72 595x841 
global.g_dpi72toCanvas = 1.4126; //水平 1.4126   垂直1.00
global.g_canvasPx2A4mm = 297.0 / 1188.0;  //水平 297/1188    垂直 210/595 
global.g_pagedirection = 'h';
global.g_mm2dpi72 = 2.823650; // 1mm in qgis layout == 2.823650 pixels in dpi72 png


//消息函数使用的全局变量
global.g_mapClipRectObject = null;
global.g_mapInnerContentChanged = false;
global.g_layoutItemArray = [] ;
global.g_fabricCanvasH = null ;
global.g_fabricCanvasV = null ;





function App() {
	//每次zoomIn zoomOut extent的变化大小
	const theZoomScale = 0.05;

	const [projectQgsFile, setProjectQgsFile] = useState('');
	const [fabricCanvasH, setFabricCanvasH] = useState(null);
	const [fabricCanvasV, setFabricCanvasV] = useState(null);
	const [layoutItemArray, setLayoutItemArray] = useState([]);
	const [layerArray, setLayerArray] = useState([]);
	const [themeArray, setThemeArray] = useState([]);
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
	const [canvasHStyle, setCanvasHStyle] = useState({ display: "block" });
	const [canvasVStyle, setCanvasVStyle] = useState({ display: "none" });
	const [isDialogExportOpen, setIsDialogExportOpen] = useState(false);
	const [currentInnerMovingMapUuid, setCurrentInnerMovingMapUuid] = useState("");
	const [dialogSelectRoiNoDrawIsOpen, setDialogSelectRoiNoDrawIsOpen] = useState(false);

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

	useEffect(() => {
		global.g_fabricCanvasH = fabricCanvasH ;
		global.g_fabricCanvasV = fabricCanvasV ;
	}, [fabricCanvasH,fabricCanvasV])
	


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
					setCanvasHStyle({ display: "block" });
					setCanvasVStyle({ display: "none" });
					setCurrentPageDirection(newdir);

				} else {
					setCanvasHStyle({ display: "none" });
					setCanvasVStyle({ display: "block" });
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
		layoutItemArray.forEach(item => {
			if (item.layoutitem.loitype === 'map') {
				mapitems.push(item);
			}
		});
		return mapitems;
	}


	/// 从layoutitemArray中查找 Item 对象 
	const helperFindLayoutItem = function (uuid) {
		let retobj = null;
		global.g_layoutItemArray.forEach(item => {
			if (item.layoutitem.uuid === uuid) {
				retobj = item;
			}
		});
		return retobj;
	}


	/// 从fabric objects 查找uuid的对象
	const helperFindFabricObject = function (uuid1) {
		let theObj1 = null;
		if (global.g_pagedirection === 'h') {
			global.g_fabricCanvasH.forEachObject(function (fobj1, index1) {
				if (fobj1.uuid === uuid1) {
					theObj1 = fobj1;
				}
			});
		} else {
			global.g_fabricCanvasV.forEachObject(function (fobj1, index1) {
				if (fobj1.uuid === uuid1) {
					theObj1 = fobj1;
				}
			});
		}

		return theObj1;
	}



	const onMTBAddVecLayer = function () {
		setDialogOpenfileType(3);
		setIsDialogOpenfileOpen(true);
	}

	const onMTBAddRoiVecLayer = function () {
		//this is geojson from server
		setDialogSelectRoiNoDrawIsOpen(true);
	}


	// 画布对象鼠标抬起事件 这类函数必须使用全局函数
	const onFabricObjectMouseUp = function (ev) {
		let newleft = ev.target.left * global.g_canvasPx2A4mm;
		let newtop = ev.target.top * global.g_canvasPx2A4mm;
		let theuuid = ev.target.uuid;
		let action = ev.transform.action;
		const theLayoutItem = helperFindLayoutItem(theuuid);
		if (theLayoutItem === null) {
			console.log("theLayoutItem === null");
			return;
		}

		if (action === 'drag' && theLayoutItem !== null) {
			if (theLayoutItem.layoutitem.loitype === 'map' && theLayoutItem.grid.enabled === 1) {
				const png_wid = ev.target.png_width;
				const png_hei = ev.target.png_height;
				const totalmapwid_mm = png_wid / global.g_mm2dpi72;
				const totalmaphei_mm = png_hei / global.g_mm2dpi72;
				const gridspacewid_mm = totalmapwid_mm - theLayoutItem.layoutitem.width;
				const gridspacehei_mm = totalmaphei_mm - theLayoutItem.layoutitem.height;
				const newleft_mm = ev.target.left * global.g_canvasPx2A4mm + gridspacewid_mm / 2;
				const newtop_mm = ev.target.top * global.g_canvasPx2A4mm + gridspacehei_mm / 2;
				newleft = newleft_mm;
				newtop = newtop_mm;
			}
		}

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

			let new_wid_mm = widthnew * global.g_canvasPx2A4mm;
			let new_hei_mm = heightnew * global.g_canvasPx2A4mm;

			if (ev.target.loitype === 'map') {

				if (theLayoutItem.grid.enabled === 1) {
					const png_wid = ev.target.png_width;
					const png_hei = ev.target.png_height;
					const totalmapwid_mm = png_wid / global.g_mm2dpi72;
					const totalmaphei_mm = png_hei / global.g_mm2dpi72;
					const gridspacewid_mm = totalmapwid_mm - theLayoutItem.layoutitem.width;
					const gridspacehei_mm = totalmaphei_mm - theLayoutItem.layoutitem.height;
					new_wid_mm = new_wid_mm - gridspacewid_mm;
					new_hei_mm = new_hei_mm - gridspacehei_mm;
				}
				//保持地图图片在左上角对齐，只改变长宽，不改变内容尺寸
				ev.target.scaleX = global.g_dpi72toCanvas;
				ev.target.scaleY = global.g_dpi72toCanvas;
				ev.target.width = widthnew / global.g_dpi72toCanvas;
				ev.target.height = heightnew / global.g_dpi72toCanvas;
			}

			let tdata = {
				uuid: theuuid, file: projectQgsFile,
				width: new_wid_mm,
				height: new_hei_mm
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
		global.g_fabricCanvasH.clear();
		global.g_fabricCanvasV.clear();

		let itemcount = itemArray.length;
		let oImgArray = [];

		let uuidFromBigZtoSmallZ = [];
		for (let i = 0; i < itemcount; ++i) {
			uuidFromBigZtoSmallZ.push(itemArray[i].layoutitem.uuid);
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
				oImg.png_width = oImg.width;
				oImg.png_height = oImg.height;
				//oImg.moveTo( item.layoutitem.z ) ;
				oImg.setCoords();
				oImg.z = item.layoutitem.z;
				if (item.layoutitem.loitype === 'north') {
					//指北针 地图 不能旋转
					oImg["lockRotation"] = true;
				}
				if (item.layoutitem.loitype === 'map') {
					oImg["lockRotation"] = true;
					//考虑是否有网格，left、top需要额外补上网格的空间
					if (item.grid.enabled === 1) {

						const totalmapwid_mm = oImg.width / global.g_mm2dpi72;
						const totalmaphei_mm = oImg.height / global.g_mm2dpi72;
						const gridspacewid_mm = totalmapwid_mm - item.layoutitem.width;
						const gridspacehei_mm = totalmaphei_mm - item.layoutitem.height;
						const newleft_mm = item.layoutitem.left - gridspacewid_mm / 2;
						const newtop_mm = item.layoutitem.top - gridspacehei_mm / 2;
						oImg.left = newleft_mm / global.g_canvasPx2A4mm;
						oImg.top = newtop_mm / global.g_canvasPx2A4mm;

					}
				}
				oImg['lockRotation'] = true;
				oImg['lockScalingFlip'] = true;
				oImg['lockSkewingX'] = true;
				oImg['lockSkewingY'] = true;

				oImgArray.push(oImg);
				if (itemcount === 0) {
					for (let i = uuidFromBigZtoSmallZ.length - 1; i >= 0; --i) {

						for (let j = 0; j < oImgArray.length; ++j) {
							if (oImgArray[j].uuid === uuidFromBigZtoSmallZ[i]) {
								if (global.g_pagedirection === 'h') {
									global.g_fabricCanvasH.add(oImgArray[j]);
								}
								else {
									global.g_fabricCanvasV.add(oImgArray[j]);
								}
							}
						}
					}
					global.g_fabricCanvasH.requestRenderAll();
					global.g_fabricCanvasV.requestRenderAll();
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
				setProjectObject(result);
				if (result.page.dir !== global.g_pagedirection) {
					helperChangePageDirection(result.page.dir);
				}

				//更新canvas
				const itemarr = result.loitem_array;
				setLayoutItemArray(itemarr);
				global.g_layoutItemArray = [...itemarr] ;

				const tlayerarray = result.layer_array;
				setLayerArray(tlayerarray);
				setThemeArray(result.theme_array) ;

				redrawMapComposerCanvas(itemarr);

			}).catch(err => {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}








	///////////////////////////////// main tool bar

	const onMTBOpen = function () {

		setDialogOpenfileType(1);
		setIsDialogOpenfileOpen(true);
	}


	const onMTBRefresh = function () {
		regenerateProjectPartsAndRedrawCanvas();
		//reloadOmcProject() ;
	}

	const onMTBExport = function () {
		setIsDialogExportOpen(true);
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
				regenerateProjectPartsAndRedrawCanvas();
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
				regenerateProjectPartsAndRedrawCanvas();
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
				regenerateProjectPartsAndRedrawCanvas();
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
				regenerateProjectPartsAndRedrawCanvas();
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
				regenerateProjectPartsAndRedrawCanvas();
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
					regenerateProjectPartsAndRedrawCanvas();
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
					regenerateProjectPartsAndRedrawCanvas();
				},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});
		} else {
			appendErrorMsg("没有地图元素，请先添加地图.");
		}
	}

	//获取style详情
	const httpGetStyleDetail = function(styleid){
		//http://192.168.56.103:15900/pe/style/detail/2
		if( styleid===0 ) return ;
		const url1 = global.g_task17apiroot + "style/detail/"+styleid;
		fetch(url1)  //GET
		.then(response=>response.json())
		.then(result => {
			if( result.state===0 ){
				const stylefilename = result.data.filename ;
				if( stylefilename !== '' ){
					httpAddStyleLegend(stylefilename) ;
				}
			}else{
				setErrorMsgArray([...errorMsgArray, result.message]);
				//regenerateProjectPartsAndRedrawCanvas();
			}
		}).catch(err=> {
			setErrorMsgArray([...errorMsgArray, err]);
		});
	}

	//添加Style到Layout
	const httpAddStyleLegend = function(stylefilename)
	{//
		if( stylefilename==='' ) return ;
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.stylefile = stylefilename ;
		callOmcRpc("layout.addstylelegend", jsondata,
			function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas();
			},
			function (err) {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}


	const onMTBAddLegend = function () {
		let someStyleid = 0 ;
		for(let lyrObj1 of layerArray)
		{
			if( lyrObj1.type==='wms' ){
				someStyleid = lyrObj1.styleid ;
				break ;
			}
		}
		if( typeof someStyleid === 'undefined' ) someStyleid = 0 ;
		
		if( someStyleid===0 ) return ;
		const url1 = global.g_task17apiroot + "style/detail/"+someStyleid;
		fetch(url1)  //GET
		.then(response=>response.json())
		.then(result => {
			if( result.state===0 ){
				const stylefilename = result.data.filename ;
				if( stylefilename !== '' ){
					httpAddStyleLegend(stylefilename) ;
				}
			}else{
				setErrorMsgArray([...errorMsgArray, result.message]);
			}
		}).catch(err=> {
			setErrorMsgArray([...errorMsgArray, err]);
		});
		


		// const mapitems = helperFindMapItems();
		// if (mapitems.length > 0) {
		// 	let jsondata = {};
		// 	jsondata.mapuuid = mapitems[0].layoutitem.uuid;
		// 	jsondata.file = projectQgsFile;
		// 	callOmcRpc("layout.addlegend", jsondata,
		// 		function (res) {
		// 			//good
					
		// 		},
		// 		function (err) {
		// 			setErrorMsgArray([...errorMsgArray, err]);
		// 		});
		// } else {
		// 	appendErrorMsg("没有地图元素，请先添加地图.");
		// }
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
		if (global.g_pagedirection === 'h') {
			global.g_fabricCanvasH.forEachObject(function (fobj1, index1) {
				fobj1.lockMovementX = isLock;
				fobj1.lockMovementY = isLock;
				fobj1.lockScalingX = isLock;
				fobj1.lockScalingY = isLock;
			});
		} else {
			global.g_fabricCanvasV.forEachObject(function (fobj1, index1) {
				fobj1.lockMovementX = isLock;
				fobj1.lockMovementY = isLock;
				fobj1.lockScalingX = isLock;
				fobj1.lockScalingY = isLock;
			});
		}

	}


	//鼠标抬起事件，当移动地图内部内容
	const onMapItemInnerMouseupHandler = function (ev) {
		global.g_mapInnerContentChanged = true;
		const map1 = ev.target;
		const cp1 = map1.clipPath;
		const rect1 = global.g_mapClipRectObject;
		cp1.left = rect1.left + 2;
		cp1.top =  rect1.top + 2;
		map1.set('dirty', true);
		httpUpdateMapExtent(map1.uuid);
	}

	//点击地图元素移动内部内容按钮
	const onLayoutItemMapStartMoveInner = function (mapuuid) {
		let map1 = helperFindFabricObject(mapuuid);
		if (map1 === null) {
			console.log("no find " + mapuuid);
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
		if (global.g_pagedirection === 'h') global.g_fabricCanvasH.add(rect);
		else fabricCanvasV.add(rect);
		map1.clipPath = clipPath2;
		map1.__eventListeners['mouseup'] = [];
		map1.on('deselected',  onMapEndMoveInner.current  );
		map1.on("mouseup", onMapItemInnerMouseupHandler);
		map1.set('dirty', true);
		if (global.g_pagedirection === 'h') global.g_fabricCanvasH.setActiveObject(map1);
		else fabricCanvasV.setActiveObject(map1);
		helperSetLockAllFabric(true);
		map1.lockMovementX = false;
		map1.lockMovementY = false;
		setCurrentInnerMovingMapUuid(mapuuid) ;
	}

	//更新地图范围
	const httpUpdateMapExtent = function(mapuuid) {
		const leftr = global.g_mapClipRectObject.left;
		const topr  = global.g_mapClipRectObject.top;
		let map1    = helperFindFabricObject(mapuuid);
		let mapitem = helperFindLayoutItem(mapuuid);
		if (map1 === null) {
			console.log("no find " + mapuuid);
			return;
		}
		const leftm = map1.left;
		const topm =  map1.top;
		const extent1 = mapitem.data.extent;
		const widthPx = map1.width * global.g_dpi72toCanvas;
		const widthll = extent1.xmax - extent1.xmin;
		const dxll = (leftm - leftr) * widthll / widthPx;
		const dyll = (topm  - topr ) * widthll / widthPx;
		let extent2 = {};
		extent2.xmin = extent1.xmin - dxll;
		extent2.xmax = extent1.xmax - dxll;
		extent2.ymin = extent1.ymin + dyll;//Y方向坐标相对X是负的，所以这里使用+
		extent2.ymax = extent1.ymax + dyll;
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.mapuuid = mapuuid;
		jsondata.dpi = 72 ;
		jsondata.xmin = extent2.xmin  ;
		jsondata.xmax = extent2.xmax  ;
		jsondata.ymin = extent2.ymin  ;
		jsondata.ymax = extent2.ymax  ;
		// here here map设置新的范围最好，重新生产缩略图，然后回调函数更新图片
		callOmcRpc("map.setextentndraw", jsondata,
			function (res) {
				map1.setSrc( global.g_staticRootUrl + res.data.src, function(newimg1){
					mapitem.data.extent=extent2;
					map1.set({left:leftr+2,top:topr+2});
					map1.set('dirty', true);
					global.g_fabricCanvasH.requestRenderAll();
					global.g_fabricCanvasV.requestRenderAll();
				}) ;
				
			}, function (err) {
				appendErrorMsg(err);
			});
	}



	//点击地图元素停止移动内部内容按钮  
	const onLayoutItemMapEndMoveInner = function(uuid){
		let ev = {} ;
		ev.target = {uuid:uuid} ;
		onMapEndMoveInnerFunc(ev) ;
	}

	const onMapEndMoveInnerFunc = function (ev) {
		const mapuuid = ev.target.uuid ;//ev.target is klass
		if (global.g_pagedirection === 'h')
			global.g_fabricCanvasH.remove(global.g_mapClipRectObject);
		else global.g_fabricCanvasV.remove(global.g_mapClipRectObject);
		global.g_mapClipRectObject = null;
		let map1 = helperFindFabricObject(mapuuid);
		if (map1 === null) {
			console.log("no find " + mapuuid);
			return;
		}
		helperSetLockAllFabric(false);
		map1.clipPath = null;
		map1.__eventListeners['deselected']=[];
		map1.__eventListeners['mouseup'] = [];
		global.g_mapInnerContentChanged = false;
		setCurrentInnerMovingMapUuid("") ;
	}
	const onMapEndMoveInner = useRef(onMapEndMoveInnerFunc) ;


	//点击按钮 layout元素编辑按钮
	const onLayoutItemEdit = function (loitem) {
		setSelectedLayoutObject(loitem);
		setIsDlgMapItemPptOpen(true);
	}

	const deleteLayoutItemByUuid = function(uuid){
		let jsondata = {};
		jsondata.file = projectQgsFile;
		jsondata.uuid = uuid;
		callOmcRpc("layout.deleteitem", jsondata,
			function (res) {
				//ok 在fabric中删除对象，不用刷新界面
				const tfaobj = helperFindFabricObject(uuid);
				if (global.g_pagedirection === 'h')
					global.g_fabricCanvasH.remove(tfaobj);
				else global.g_fabricCanvasV.remove(tfaobj);
				//从layoutitem面板删除item
				let newItemArr = layoutItemArray.filter(item1 => item1.layoutitem.uuid !== uuid);
				setLayoutItemArray(newItemArr);
			}, function (err) {
				appendErrorMsg(err);
			});
	}

	const onLayoutItemDelete = function (loitem) {
		deleteLayoutItemByUuid(loitem.layoutitem.uuid) ;
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
				regenerateProjectPartsAndRedrawCanvas();
			},
				function (err) {
					setErrorMsgArray([...errorMsgArray, err]);
				});
		} else if (filetype === 3) {
			httpAddVecShpOrGeojsonToMap(
				projectQgsFile,
				nameOrEmpty,
				relfilename
			);
		}
		setIsDialogOpenfileOpen(false);
	}
	const onDialogOpenFileCancel = function () {
		setIsDialogOpenfileOpen(false);
	}


	// END //////////////////////////////////////////////


	const httpAddVecShpOrGeojsonToMap = function(qgsfile,vecname,refShpOrGeojsonfilename){
		let jsondata = {};
			jsondata.file = qgsfile;
			jsondata.vecname = vecname;
			jsondata.vecfile = refShpOrGeojsonfilename;
			callOmcRpc("project.addvec", jsondata, 
			function (res) {
				//good
				regenerateProjectPartsAndRedrawCanvas();
			},
			function (err) {
				setErrorMsgArray([...errorMsgArray, err]);
			});
	}





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
	const onDialogExportOk = function (data) {

		setIsDialogExportOpen(false);
	}

	const onDialogExportCancel = function () {
		setIsDialogExportOpen(false);
	}

	//  导出作图对话框 END  ---------------------------------------------------------




	const onHoriCanvasKeyUp=function(ev) {
		if( typeof ev.keyCode !== 'undefined' && ev.keyCode===46){
			//delete
			const activeObjs = fabricCanvasH.getActiveObjects() ;
			for(const obj1 of activeObjs){
				deleteLayoutItemByUuid(obj1.uuid) ;
			}
		}
	}

	const onVertCanvasKeyUp=function(ev) {
		if( typeof ev.keyCode !== 'undefined' && ev.keyCode===46){
			//delete
			const activeObjs = fabricCanvasV.getActiveObjects() ;
			for(const obj1 of activeObjs){
				deleteLayoutItemByUuid(obj1.uuid) ;
			}
		}
	}


	////////////////////////////////////////
	
	const onDialogSelectRoiNoDrawIsOpenOnOk = function(roi){
		console.log("debug 2 add vec from roi.") ;
		console.log(roi) ;
		httpAddVecShpOrGeojsonToMap(
			projectQgsFile,
			roi.name ,
			roi.geojson 
			);
		setDialogSelectRoiNoDrawIsOpen(false);
	}
	const onDialogSelectRoiNoDrawIsOpenOnCancel = function(){
		setDialogSelectRoiNoDrawIsOpen(false);
	}


	//
	//
	//
	return (
		<div className="App" >
			<div className="AppContainer">

				{/* 顶部工具栏 */}
				<McMainToolbarPanel
					onOpen={onMTBOpen}
					onAddVecLayer={onMTBAddVecLayer}
					onAddRoiVecLayer={onMTBAddRoiVecLayer}
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
						themeArray={themeArray}
					/>





					{/* 地图元素面板 */}
					<MapItemPanel
						layoutItemArray={layoutItemArray}
						onLayoutItemEdit={onLayoutItemEdit}
						onLayoutItemDelete={onLayoutItemDelete}
						onMapItemEnableInner={onLayoutItemMapStartMoveInner}
						onMapItemDisableInner={onLayoutItemMapEndMoveInner}
						onMapItemZoomIn={onMapItemZoomIn}
						onMapItemZoomOut={onMapItemZoomOut}
						currentInnerMovingMapUuid={currentInnerMovingMapUuid}
					/>


					{/* 绘图区域 */}
					<div
						className="AppCanvasContainer"
					>
						<div className="AppCanvasContainerInnerHori"
							style={canvasHStyle}
							onKeyUp={onHoriCanvasKeyUp}
							tabIndex="0"
						>
							<canvas id="fabricCanvasH" width={1188} height={840} ></canvas>
						</div>

						<div className="AppCanvasContainerInnerVert"
							style={canvasVStyle}
							onKeyUp={onVertCanvasKeyUp}
							tabIndex="0"
						>
							<canvas id="fabricCanvasV" width={595} height={841} 
							></canvas>
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
				projectObject={projectObject}
				themeArray={themeArray}
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
				onOk={onDialogExportOk}
				projectQgsFile={projectQgsFile}
				callOmcRpc={callOmcRpc}
				appendErrorMsg={appendErrorMsg}
			/>

			{/* 系统感兴趣区 */}
			<DialogSelectRoiNoDraw
			isOpen={dialogSelectRoiNoDrawIsOpen}
			onOk={onDialogSelectRoiNoDrawIsOpenOnOk}
			onCancel={onDialogSelectRoiNoDrawIsOpenOnCancel}
			uid={theUid}
			/>

		</div>


	);
}

export default App;
