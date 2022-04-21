import React, { useState, useEffect } from 'react'


import BoDialogSimple from './BoDialogSimple';
import { Container, Button, Card, Row, Col, Form, Image, Table } from 'react-bootstrap';

import LayoutItemPropery from '../components/LayoutItemPropery';
import MapGrid from '../components/MapGrid';
import PolyStyle from '../components/PolyStyle';
import LabelProperty from '../components/LabelProperty';

//onOk
//onCancel
//isOpen
//theObject
//projectQgsFile
//callOmcRpc 
//appendErrorMsg 
//regenerateProjectPartsAndRedrawCanvas
function DialogMapItemProperty(props) {

    const [theTitle, setTheTitle] = useState("地图元素属性");
    const [currObject, setCurrObject] = useState(props.theObject);

    useEffect(() => {
        setCurrObject(props.theObject);

    }, [props.theObject]);// layoutitem

    const onOk = function () {

        if( typeof currObject === 'undefined'|| currObject===null) return ;

        let jsondata = {...currObject} ;
        jsondata.file = props.projectQgsFile ;
        jsondata.uuid = currObject.layoutitem.uuid ;
        jsondata.loitype= currObject.layoutitem.loitype ; 
        console.log("item.setproperty") ;
        console.log(jsondata) ;

        props.callOmcRpc("item.setproperty" , jsondata, 
		function(res){
			//ok
			props.regenerateProjectPartsAndRedrawCanvas() ;
            props.onOk() ;
		}, function(err){
			props.appendErrorMsg(err) ;
		}) ;
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


    const onChangePolyStyle = function(obj){
        let newobj = {...currObject} ;
        newobj.data.polysymbol = obj ;
        setCurrObject(newobj) ;
    }

    const onChangeLabel = function(obj){
        let newobj = {...currObject} ;
        newobj.data = obj ;
        setCurrObject(newobj) ;
    }


    const renderContent = function () {
        return (
            <Table>
                {
                    (typeof currObject === 'undefined' || currObject===null ) ? "currObject undefined." : (
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
                                (currObject !== null &&
                                    (currObject.layoutitem.loitype === 'ell'
                                    || currObject.layoutitem.loitype === 'rect' )
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