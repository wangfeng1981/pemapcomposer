import React, { useState, useEffect } from 'react'


import BoDialogSimple from './BoDialogSimple';
import { Container, Button, Card, Row, Col, Form, Image, Table,FormCheck } from 'react-bootstrap';

import LayoutItemPropery from '../components/LayoutItemPropery';
import MapGrid from '../components/MapGrid';
import PolyStyle from '../components/PolyStyle';
import LabelProperty from '../components/LabelProperty';
import PeStyleProperty from '../components/PeStyleProperty';
//onOk
//onCancel
//isOpen
//theObject
//projectQgsFile
//callOmcRpc 
//appendErrorMsg 
//regenerateProjectPartsAndRedrawCanvas
//projectObject
//props.themeArray
function DialogMapItemProperty(props) {

    const [theTitle, setTheTitle] = useState("地图元素属性");
    const [currObject, setCurrObject] = useState(props.theObject);
    const [crsArray, setCrsArray] = useState([]);
    const [themeArray2, setThemeArray2] = useState([])
    
    useEffect(() => {
        if( typeof props.themeArray !== 'undefined' 
        && props.themeArray!== null ){
            setThemeArray2( props.themeArray ) ;
        }
    }, [props.themeArray])
    


    useEffect(() => {
        setCurrObject(props.theObject);

    }, [props.theObject]);// layoutitem


    useEffect(() => {
        if (typeof props.projectObject !== 'undefined' && props.projectObject !== null) {
            setCrsArray(props.projectObject.crs_array);
        }
    }, [props.projectObject])



    const onOk = function () {

        if (typeof currObject === 'undefined' || currObject === null) return;

        let jsondata = { ...currObject };
        jsondata.file = props.projectQgsFile;
        jsondata.uuid = currObject.layoutitem.uuid;
        jsondata.loitype = currObject.layoutitem.loitype;
        console.log("item.setproperty");
        console.log(jsondata);

        props.callOmcRpc("item.setproperty", jsondata,
            function (res) {
                //ok
                props.regenerateProjectPartsAndRedrawCanvas();
                props.onOk();
            }, function (err) {
                props.appendErrorMsg(err);
            });
    }

    const onCancel = function () {
        props.onCancel();
    }


    const onChangeLayoutItem = function (obj) {
        let newobj = { ...currObject };
        newobj.layoutitem = obj;
        setCurrObject(newobj);

    }


    const onChangeGrid = function (obj) {
        let newobj = { ...currObject };
        newobj.grid = obj;
        setCurrObject(newobj);
    }


    const onChangePolyStyle = function (obj) {
        let newobj = { ...currObject };
        newobj.data.polysymbol = obj;
        setCurrObject(newobj);
    }

    const onChangeLabel = function (obj) {
        let newobj = { ...currObject };
        newobj.data = obj;
        setCurrObject(newobj);
    }

    const onChangedCrs = function (ev) {
        let newobj = { ...currObject };
        newobj.data.authid = ev.target.value;
        setCurrObject(newobj);
    }

    const oneZero2Bool = function(ival){
        if( ival===0)return false ;
        else return true ;
    }


    const onUseThemeChanged = function(ev){
        let newobj = {...currObject} ;
        newobj.data.following_vis_preset = (ev.target.checked)?1:0;
        setCurrObject(newobj) ;
    }

    const onChangeTheme = function(ev){
        let newobj = {...currObject} ;
        newobj.data.vis_preset =ev.target.value ;
        setCurrObject(newobj) ;
    }

    const onChangePeStylePpt = function( newdata ){
        let newobj = {...currObject} ;
        newobj.data = newdata ;
        setCurrObject(newobj);
    }


    const renderContent = function () {
        return (
            <Table>
                {
                    (typeof currObject === 'undefined' || currObject === null) ? "currObject undefined." : (
                        <tbody>
                            {
                                (currObject !== null) ? <LayoutItemPropery
                                    theObject={currObject.layoutitem}
                                    onChange={onChangeLayoutItem}
                                /> : ""
                            }
                            {
                                (currObject !== null && currObject.layoutitem.loitype === 'map') ? (
                                    <MapGrid theObject={currObject.grid}
                                        onChange={onChangeGrid}
                                    />
                                ) : ""
                            }
                            {
                                (currObject !== null && currObject.layoutitem.loitype === 'map') ? (
                                    <>
                                        <tr>
                                            <td>使用Theme</td>
                                            <td>
                                            <FormCheck
                                                type={'checkbox'}
                                                label={""}
                                                checked={oneZero2Bool(currObject.data.following_vis_preset)}
                                                onChange={onUseThemeChanged}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>地图Theme</td>
                                            <td>
                                            <select className="form-select"
                                                value={currObject.data.vis_preset}
                                                onChange={onChangeTheme} >
                                                {
                                                    themeArray2.map((item, index) => (
                                                        <option key={'key' + index} 
                                                        value={item.name}>{item.name}</option>
                                                    )
                                                    )
                                                }
                                            </select>
                                            </td>
                                        </tr>
                                    </>

                                ) : ""
                            }
                            {
                                (currObject !== null && currObject.layoutitem.loitype === 'map') ? (
                                    <tr>
                                        <td>坐标系</td>
                                        <td>
                                            <select className="form-select"
                                                value={currObject.data.authid} onChange={onChangedCrs} >
                                                {
                                                    crsArray.map((crsitem, index) => (
                                                        <option key={'key' + index} value={crsitem.authid}>{crsitem.crsdescription}</option>
                                                    )
                                                    )
                                                }
                                            </select>
                                        </td>
                                    </tr>
                                ) : ""
                            }
                            {
                                (currObject !== null &&
                                    (currObject.layoutitem.loitype === 'ell'
                                        || currObject.layoutitem.loitype === 'rect')
                                ) ? (
                                    <PolyStyle theObject={currObject.data.polysymbol}
                                        onChange={onChangePolyStyle}
                                    />
                                ) : ""
                            }
                            {
                                (currObject !== null &&
                                    (currObject.layoutitem.loitype === 'label')
                                ) ? (
                                    <LabelProperty theObject={currObject.data}
                                        onChange={onChangeLabel}
                                    />
                                ) : ""
                            }
                            {
                                (currObject !== null &&
                                    (currObject.layoutitem.loitype === 'pestylelegend')
                                ) ? (
                                    <PeStyleProperty 
                                    theObject={currObject.data}
                                    onChange={onChangePeStylePpt}
                                    />
                                ) : ""
                            }
                        </tbody>
                    )
                }

            </Table>
        )
    }


    return (
        <BoDialogSimple isOpen={props.isOpen}
            onCancel={onCancel}
            onOk={onOk}
            title={theTitle}
            renderContent={renderContent}
        />
    )
}

export default DialogMapItemProperty