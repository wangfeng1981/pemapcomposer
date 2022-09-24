import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./DialogStyleFromWorkBenchApp.css"
import "./DialogGeneralCategoriesData.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons'; 

//props.isOpen
//props.dialogTitle
//props.catCount
//props.getCatName(catindex)  //获取分类名称，字符串
//props.renderCatContentHeader(catindex) //渲染顶部内容
//props.getCatData(catindex)  //返回该分类下的数据数组，如果没有数据可以返回一个空数组 []
//props.renderDataCell(catIndex,dataIndex,data1)
//props.onOk( currentCatIndex , currentDataIndex )
//props.onCancel()
//props.renderSearchBar
//props.changeCatIndex
//props.onCatChanged
function DialogGeneralCategoriesData2(props) {

    //为了循环构造的辅助数组
    const [catArray, setCatArray] = useState([]);
    //当前分类
    const [currentCatIndex, setCurrentCatIndex] = useState(-1);
    //当前数据
    const [currentDataIndex, setCurrentDataIndex] = useState(-1);


    useEffect(() => {
        let arr = [];
        for (let i = 0; i < props.catCount; ++i) {
            arr.push(i);
        }
        setCatArray(arr);
    }, [props.catCount]);

    useEffect(() => {
        if( typeof props.changeCatIndex !== 'undefined' 
            && props.changeCatIndex >= 0
            && props.changeCatIndex != currentCatIndex 
        ){
            onCatCellClickedCallback(props.changeCatIndex) ;
        }
    }, [props.changeCatIndex])
    


    const onOkButtonClickedCallback = function () {
        props.onOk(currentCatIndex, currentDataIndex);
    }

    const onCatCellClickedCallback = function (catindex) {
        if (catindex !== currentCatIndex) {
            setCurrentCatIndex(catindex);
            if( typeof props.onCatChanged!=='undefined' ){
                props.onCatChanged(catindex);
            }
            setCurrentDataIndex(-1);
        }
    }

    const onDataCellClickedCallback = function (dataindex) {
        if (dataindex !== currentDataIndex) {
            setCurrentDataIndex(dataindex);
        }
    }


    //选中状态背景图片
    const checkBackgroundImageStyle = {
        backgroundImage: "url(/images/check.png)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center right 29px"
    };
    const checkStyle = {
        position:'absolute',
        top:'17px',
        right:'20px'
    }

    return (
        <Modal
            size="lg"
            show={props.isOpen}
            dialogClassName="rsbig-modal"
            contentClassName="rsbig-modal-content"
        >
                <div style={{padding:'2px'}}><span className='DialogGeneralCategoriesDataTitleSlash'></span>{props.dialogTitle}</div>
                <div className="DialogGeneralCategoriesDataSearchContainer">
                    {(typeof props.renderSearchBar!=='undefined')?props.renderSearchBar():""}
                </div>

                <div className="DialogGeneralCategoriesDataContent">
                    <div className="DialogGeneralCategoriesDataCatContainer">
                        {
                            catArray.map(
                                (val, index) => (
                                    <div
                                        key={'key' + index}
                                        className={(index === currentCatIndex) ? 'DialogGeneralCategoriesDataCatCell Active' : 'DialogGeneralCategoriesDataCatCell'}
                                        onClick={() => onCatCellClickedCallback(index)}>{props.getCatName(index)}</div>
                                )
                            )
                        }
                    </div>
                    <div className="DialogGeneralCategoriesDataDataContainer">
                        {
                            // 内存区域顶部界面
                            props.renderCatContentHeader(currentCatIndex)
                        }
                        {
                            props.getCatData(currentCatIndex).map(
                                (data1, index) => (
                                    <div key={'key2-' + index} onClick={() => onDataCellClickedCallback(index)}
                                        className={(index === currentDataIndex) ? 'DialogGeneralCategoriesDataDataCell Active' : 'DialogGeneralCategoriesDataDataCell'}
                                        >
                                        {/* 动态渲染单元格 style={(index === currentDataIndex) ? checkBackgroundImageStyle : {}} */}
                                        {props.renderDataCell(currentCatIndex, index, data1)}
                                        {(index === currentDataIndex)?<div style={checkStyle}><FontAwesomeIcon icon={faCheck} color="green" /></div>:null}
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>

                <div className="DialogGeneralCategoriesDataFooter">
                    <Button className='rsbig-button' style={{ float: 'left' }}  variant="secondary" size="sm" >帮助</Button>
                    <Button className='rsbig-button' style={{ float: 'right' }} variant="secondary" size="sm" onClick={props.onCancel} >取消</Button>
                    <Button className='rsbig-button' 
                    style={{ backgroundColor:'rgb(53, 151, 209)', float: 'right',marginRight:'10px' }} 
                    variant="primary" 
                    size="sm" 
                    onClick={onOkButtonClickedCallback}>确定</Button>
                    <div style={{ clear: 'both' }}></div>
                </div>
            

        </Modal>
    );
}

export default DialogGeneralCategoriesData2;
