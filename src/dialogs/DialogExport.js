import React, { useState, useEffect } from 'react'


import BoDialogSimple from './BoDialogSimple';
import { Container, Button, Card, Row, Col, Form, Image, Table,FormCheck } from 'react-bootstrap';




// projectQgsFile
// onOk
// onCancel
// isOpen
//callOmcRpc={callOmcRpc}
//appendErrorMsg={appendErrorMsg}
function DialogExport(props) {

    const [clipToExtent, setClipToExtent] = useState(false);
    const [theDpi, setTheDpi] = useState(300) ;


    const onOk = function () {
        let jsondata= {} ;
        jsondata.file = props.projectQgsFile ;
        jsondata.dpi = parseInt(theDpi) ;
        jsondata.clip = (clipToExtent)?1:0 ;

        props.callOmcRpc("layout.exportimg",jsondata,
        function(res){
            const fullimgurl = global.g_staticRootUrl +  res.data.img ;
            window.open(fullimgurl,"_blank") ;
            props.onOk();
        },
        function(err){
            props.appendErrorMsg(err) ;
        }
        )
    }

    const onCancel = function () {
        props.onCancel();
    }

    const onChangeClip = function (ev) {
        setClipToExtent(ev.target.checked);
    }

    const onChangeDpi = function(ev){
        setTheDpi( parseInt(ev.target.value) ) ;
    }


    const renderContent = function () {
        return (
            <Table>
                <tbody>
                    <tr>
                        <td>DPI(72~350)</td>
                        <td>
                            <Form.Control type="text"
                                value={theDpi}
                                onChange={onChangeDpi}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>按内容范围裁剪</td>
                        <td>
                            <FormCheck
                                type={'checkbox'}
                                label={""}
                                checked={clipToExtent}
                                onChange={onChangeClip}
                            />
                        </td>
                    </tr>
                </tbody>
            </Table>
        )
    }


    return (
        <BoDialogSimple isOpen={props.isOpen}
            onCancel={onCancel}
            onOk={onOk}
            title={"导出作图"}
            renderContent={renderContent}
        />
    )
}

export default DialogExport