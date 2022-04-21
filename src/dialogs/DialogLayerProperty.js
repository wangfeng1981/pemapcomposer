import React, { useState, useEffect } from 'react'


import BoDialogSimple from './BoDialogSimple';
import { Container, Button, Card, Row, Col, Form, Image, Table } from 'react-bootstrap';


import PolyStyle from '../components/PolyStyle';
import LineStyle from '../components/LineStyle';
import PointStyle from '../components/PointStyle';



//onOk
//onCancel
//isOpen
//theObject
//projectQgsFile
//callOmcRpc 
//appendErrorMsg 
//regenerateProjectPartsAndRedrawCanvas
function DialogLayerProperty(props) {

    const [currObject, setCurrObject] = useState(props.theObject);



    useEffect(() => {
        setCurrObject(props.theObject);

    }, [props.theObject]);// layoutitem




    const onOk = function () {
        if( typeof currObject === 'undefined' || currObject===null) return ;

        let jsondata = {...currObject} ;
        jsondata.file = props.projectQgsFile ;
        console.log("layer.setproperty") ;
        console.log(jsondata) ;

        props.callOmcRpc("layer.setproperty" , jsondata, 
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


    const onChangePointStyle  = function(obj){
        let newobj = {...currObject} ;
        newobj.data.pointsymbol = obj ;
        setCurrObject(newobj) ;
    }

    const onChangeLineStyle = function(obj) {
        let newobj = {...currObject} ;
        newobj.data.linesymbol = obj ;
        setCurrObject(newobj) ;
    }

    const onChangePolyStyle = function(obj){
        let newobj = {...currObject} ;
        newobj.data.polysymbol = obj ;
        setCurrObject(newobj) ;
    }



    const renderContent = function () {
        return (
            <Table>
                {
                    (typeof currObject === 'undefined' || currObject === null) ? "currObject undefined." : (
                        <tbody>
                            {
                                (currObject !== null && currObject.type2 === 1) ? (
                                    <PointStyle
                                    theObject={currObject.data.pointsymbol}
                                    onChange={onChangePointStyle}
                                    />
                                ) : ""
                            }
                            {
                                (currObject !== null && currObject.type2 === 2) ? (
                                    <LineStyle theObject={currObject.data.linesymbol}
                                        onChange={onChangeLineStyle}
                                    />
                                ) : ""
                            }
                            {
                                (currObject !== null && currObject.type2 === 3) ? (
                                    <PolyStyle theObject={currObject.data.polysymbol}
                                        onChange={onChangePolyStyle}
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
            title={"图层属性"}
            renderContent={renderContent}
        />
    )
}

export default DialogLayerProperty