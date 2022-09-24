import React, { useState, useEffect, useCallback } from 'react'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DialogGeneralCategoriesData2 from "./DialogGeneralCategoriesData2"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';



//props.isOpen
//props.onOk(roiObj)
//props.onCancel
//props.uid
function DialogSelectRoiNoDraw(props) {

    //系统ROI分类列表
    const [sysCats, setSysCats] = useState([]);
    //用于显示的分类列表 { catname:'' , }
    const [catCount, setCatCount] = useState(0);//syscats数量加上 4 （矩形，多边形，上传和用户）
    const [userData, setUserData] = useState([]);//用户ROI数据

    const [searchKey, setSearchKey] = useState("");
    const [changeCatIndex, setChangeCatIndex] = useState(-1);
    const [searchData, setSearchData] = useState([]);


    //每页数量
    const pageSize = 20;


    //初始加载
    useEffect(() => {

        if (props.isOpen === true) {
            let tempCats = [];
            const url = global.g_serverAPIRoot + 'roi/cat';
            fetch(url).then(response => response.json()).then(
                (jsonData) => {
                    let catArr = jsonData.data;
                    for (let i = 0; i < catArr.length; ++i) {
                        catArr[i].ipage = 0;
                        httpLoadSysData(catArr[i].rcid, 0).then((items) => catArr[i].items = items);
                    }
                    httpLoadUserData();
                    setSysCats(catArr);
                    setCatCount(jsonData.data.length + 2);// add my and search
                    if( changeCatIndex<0 ) setChangeCatIndex(0) ;
                }
            );
        }
    }, [props.isOpen]);


   

    //加载分类数据
    const httpLoadSysData = async function (rcid, offset) {
        const url = global.g_serverAPIRoot + 'roi/sys?cat=' + rcid + "&offset=" + offset;
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData.data;
    }

    //加载用户数据
    const httpLoadUserData = async function () {
        const url = global.g_serverAPIRoot + 'roi/user?uid=' + props.uid;
        const response = await fetch(url);
        const jsonData = await response.json();
        setUserData(jsonData.data);
    }

    //加载搜索数据
    const httpLoadSearchData = function (keyval) {
        const url = global.g_serverAPIRoot + 'roi/seach?uid=' + props.uid
        +"&key="+keyval;
        fetch(url)  //GET
        .then(response=>response.json())
        .then(result => {
            setSearchData(result.data);
        }).catch(err=> {
            console.log(err) ;// 505 404 ... errors
        });
    }



    //换页
    const onChangeSysDataPage = function (catindex, ipageBasedOne) {
        const nPage = Math.ceil(sysCats[catindex].count / pageSize);
        if (ipageBasedOne < 0 || ipageBasedOne > nPage) return;

        let rcid = sysCats[catindex].rcid;
        const ipage = parseInt(ipageBasedOne);
        let offset = (ipage - 1) * pageSize;
        if (offset < 0) offset = 0;
        httpLoadSysData(rcid, offset).then(
            function (items) {
                let newSysCats = [...sysCats];
                newSysCats[catindex].items = items;
                newSysCats[catindex].ipage = ipage - 1;
                setSysCats(newSysCats);
                
            }
        );
    }



    

    //列表头渲染
    const renderCatContentHeader = function (catindex) {
        const sysCatLen = sysCats.length;
        if (catindex >= 0 && catindex < sysCatLen) {
            const nPage = Math.ceil(sysCats[catindex].count / pageSize);
            return (
                <div style={{ margin: '4px' }}>
                    <InputGroup size="sm" >
                        <Form.Control
                            type='number' size='sm'
                            value={sysCats[catindex].ipage + 1}
                            onChange={(e) => onChangeSysDataPage(catindex, e.target.value)}
                        />
                        <InputGroup.Text id="basic-addon2">/ 总{nPage}页</InputGroup.Text>
                    </InputGroup >
                </div>
            )
        }
        return "";
    }

    //分类名称
    const getCatName = function (catindex) {
        const sysCatLen = sysCats.length;
        if (catindex >= 0 && catindex < sysCatLen) {
            return sysCats[catindex].name;
        } else if (catindex === sysCatLen) {
            return "我的";
        } else {
            return "搜索结果";
        }
    }

    //获取分类数据数组
    const getCatData = function (catindex) {
        if (catindex >= 0 && catindex < sysCats.length) {
            if (typeof (sysCats[catindex].items) !== 'undefined')
                return sysCats[catindex].items;
            else return [];
        } else if (catindex === sysCats.length ) {
            return userData;
        } else if( catindex === sysCats.length+1 ){
            return searchData;
        }
        return [];
    }

    //删除我的ROI
    const onDeleteMyRoi = function (rid) {
        const url = global.g_serverAPIRoot + "roi/remove";
        let formData = new FormData();
        formData.append("rid", rid);
        fetch(url,
            {
                method: 'POST',
                body: formData
            }
        ).then(response => response.json()).then((result) => {
            httpLoadUserData();
        });
    }


    const onSearchFocus = function () {
        setChangeCatIndex( catCount -1 ) ;
    }

    const onSearchKeyChanged = function(ev) {
        setSearchKey(ev.target.value);
        let key1 = ev.target.value.trim() ;
        if( key1==="" ){
            setSearchData([]);
        }else {
            httpLoadSearchData(key1);
        }
    }

    //搜索对话框
    const renderSearchBar = function () {
        return (
            <Form.Control size='sm'
                placeholder='关键字搜索'
                style={{ marginTop:'2px',paddingLeft:'4px',
                height:'24px'}}
                value={searchKey}
                onChange={onSearchKeyChanged}
                onFocus={onSearchFocus}
            />
        )
}


//渲染单元格
const renderDataCell = function (catindex, dataindex) {
    if (catindex >= 0 && catindex < sysCats.length) {
        //system
        return (
            <div>
                <div style={{ fontSize: '16px' }}>{sysCats[catindex].items[dataindex].name} </div>
                <div style={{ color: 'gray', fontSize: '15px' }}>
                    {sysCats[catindex].items[dataindex].name2}
                    <span style={{ marginLeft: '8px', fontStyle: 'Italic' }}>sys:{sysCats[catindex].items[dataindex].rid}</span>
                </div>
            </div>
        );
    } else if (catindex === sysCats.length ) {
        //user
        return (
            <div>
                <div style={{ fontSize: '16px' }}>
                    {userData[dataindex].name}
                </div>
                <div style={{ color: 'gray', fontSize: '15px' }}>
                    创建时间:{userData[dataindex].ctime}
                    <span style={{ marginLeft: '8px', fontStyle: 'Italic' }}>user:{userData[dataindex].rid}</span>
                    <Button style={{marginRight:'64px',float:'right',width:'64px',padding:'1px'}}
                    variant="danger"
                    onClick={() => onDeleteMyRoi(userData[dataindex].rid)}
                    >
                    删除
                    </Button> 
                    <div style={{clear:'both'}}></div>
                </div>
            </div>
        );
    } 
    else if (catindex === sysCats.length + 1) {
        //search results
        return (
            <div>
                <div style={{ fontSize: '16px' }}>
                    {searchData[dataindex].name}
                </div>
                <div style={{ color: 'gray', fontSize: '15px' }}>
                    {searchData[dataindex].name2}
                </div>
            </div>
        );
    }
    else {
        return "";
    }

}





//点击确定
const onOkCallback = function (catindex, dataindex) {
    if (catindex >= 0 && catindex < sysCats.length) {
        //system
        if (dataindex >= 0 && dataindex < sysCats[catindex].items.length) {
            props.onOk({ ...sysCats[catindex].items[dataindex], from: 'server' });
        }
    } else if (catindex === sysCats.length ) {
        //user
        if (dataindex >= 0 && dataindex < userData.length) {
            props.onOk({ ...userData[dataindex], from: 'server' });
        }
    }
    else if (catindex === sysCats.length + 1) {
        //search
        if (dataindex >= 0 && dataindex < searchData.length) {
            props.onOk({ ...searchData[dataindex], from: 'server' });
        }
    }
     
}


//点击取消 做一些处理然后再调用 props.onCancel
const onCancel = function () {
    props.onCancel();
}

const onCatChanged = function(newCatIndex){
    setChangeCatIndex(newCatIndex);
}

return (
    //props.isOpen
    //props.dialogTitle
    //props.catCount
    //props.getCatName(catindex)  //获取分类名称，字符串
    //props.renderCatContentHeader(catindex) //渲染顶部内容
    //props.getCatData(catindex)  //返回该分类下的数据数组，如果没有数据可以返回一个空数组 []
    //props.renderDataCell(catIndex,dataIndex,data1)
    //props.onOk( currentCatIndex , currentDataIndex )
    //props.onCancel()
    <DialogGeneralCategoriesData2
        isOpen={props.isOpen}
        dialogTitle={"选择感兴趣区"}
        catCount={catCount}
        getCatName={getCatName}
        renderCatContentHeader={renderCatContentHeader}
        getCatData={getCatData}
        renderDataCell={renderDataCell}
        onOk={onOkCallback}
        onCancel={onCancel}
        renderSearchBar={renderSearchBar}
        changeCatIndex={changeCatIndex}
        onCatChanged={onCatChanged}
    />
);
}

export default DialogSelectRoiNoDraw;
