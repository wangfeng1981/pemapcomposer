import React, { useState, useEffect } from 'react';

import BoDialogSimple from './BoDialogSimple';
import { Container, Button, Card, Row, Col, Form, Image, Table } from 'react-bootstrap';



//type 1-qgs,2-img,3-vec
//onOk
//onCancel
//isOpen
//uid
//appendErrorMsg
function DialogSimpleOpenfile(props) {

    const [theTitle, setTheTitle] = useState("");
    const [fileArray, setFileArray] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);


    const refreshFileList = function () {
        let url1 = global.g_task17apiroot +
            "omc/filelist?uid=" + props.uid + "&type=" + props.type;
        fetch(url1)  //GET
            .then(response => response.json())
            .then(result => {
                if (result.state === 0) {
                    setFileArray(result.data);
                } else {
                    props.appendErrorMsg(result.message);
                }
            }).catch(err => {
                console.log(err);// 505 404 ... errors
            });
    }

    useEffect(() => {
        if (props.type === 1) {
            setTheTitle("打开作图工程");
        } else if (props.type === 2) {
            setTheTitle("插入图片");
        } else if (props.type === 3) {
            setTheTitle("添加矢量图层");
        }
        refreshFileList();
    }, [props.type, props.isOpen, props.uid]);

    const onUploadImage = function (ev) {
        console.log("uploading image");
        ev.preventDefault();
        if (ev.target[0].files.length === 0) return;
        let formData = new FormData;
        formData.append("uid", props.uid);
        formData.append("files", ev.target[0].files[0]);
        const url = global.g_task17apiroot + "omc/uploadimg"
        fetch(
            url,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.state === 0) {
                    const relfilename = result.data;
                    console.log(relfilename);
                    refreshFileList();
                } else {
                    console.log(result);
                }
            }).catch(err => {
                console.log(err);
            });
    }


    const onUploadVector = function (ev) {
        console.log("uploading vector");
        ev.preventDefault();
        if (ev.target[0].files.length !== 4) return;
        let formData = new FormData;
        formData.append("uid", props.uid);
        formData.append("files", ev.target[0].files[0]);
        formData.append("files", ev.target[0].files[1]);
        formData.append("files", ev.target[0].files[2]);
        formData.append("files", ev.target[0].files[3]);
        const url = global.g_task17apiroot + "omc/uploadshp"
        fetch(
            url,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.state === 0) {
                    const relfilename = result.data;
                    console.log(relfilename);
                    refreshFileList();
                } else {
                    console.log(result);
                }
            }).catch(err => {
                console.log(err);
            });

    }

    const onDeleteClick = function (item){
        let formData = new FormData;
        formData.append("omcid", item.omcid);
        const url = global.g_task17apiroot + "omc/delfile"
        fetch(
            url,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.state === 0) {
                    refreshFileList();
                } else {
                    console.log(result);
                }
            }).catch(err => {
                console.log(err);
            });
    }


    const renderContent = function () {

        return (
            <>
                <div style={{ marginBottom: '8px' }}>
                    {
                        (props.type === 2) ? (
                            <Form onSubmit={onUploadImage}>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>上传图片文件(*jpg|*.png)</Form.Label>
                                    <Row>
                                        <Col >
                                            <Form.Control type="file" name="files" />
                                        </Col>
                                        <Col sm="2">
                                            <Button size="md"
                                                variant="outline-secondary"
                                                type="submit"
                                            >
                                                上传</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Form>

                        ) : ""
                    }
                    {
                        (props.type === 3) ? (
                            <Form onSubmit={onUploadVector}>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>上传ESRI Shape文件(*.shp,*.shx,*.prj,*.dbf)</Form.Label>
                                    <Row>
                                        <Col >
                                            <Form.Control type="file" multiple name="files" />
                                        </Col>
                                        <Col sm="2">
                                            <Button
                                                size="md"
                                                variant="outline-secondary"
                                                type="submit"
                                            >
                                                上传</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Form>

                        ) : ""
                    }

                </div>
                <Table striped bordered hover><tbody>
                    {
                        fileArray.map((item, index) => (
                            <tr key={'key' + index}
                                onClick={() => setSelectedIndex(index)}
                            >
                                {
                                    (props.type === 2) ? (
                                        <td sm="1">
                                            <Image thumbnail
                                                width="64"
                                                src={global.g_staticRootUrl + item.file}
                                            />
                                        </td>
                                    ) : ""
                                }
                                {
                                    (props.type === 3) ? (
                                        <td sm="1">
                                            {
                                                (item.type2 === 1) ? (
                                                    <Image width="32" src="./images/mc/vec-point.png" />
                                                ) : ""
                                            }
                                            {
                                                (item.type2 === 2) ? (
                                                    <Image width="32" src="./images/mc/vec-line.png" />
                                                ) : ""
                                            }
                                            {
                                                (item.type2 === 3) ? (
                                                    <Image width="32" src="./images/mc/vec-poly.png" />
                                                ) : ""
                                            }

                                        </td>
                                    ) : ""
                                }
                                <td>
                                    {item.name}
                                </td>
                                <td width={100}>
                                    <Button size="sm" variant="outline-danger"
                                    onClick={()=>onDeleteClick(item)}
                                    >
                                        删除
                                    </Button>
                                    {
                                        (selectedIndex === index) ? (
                                            <img
                                                src="./images/mc/check.png"
                                                width="16" height="16" />) : ""
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody></Table>
            </>

        )
    }



    const onCancel = function () {
        setSelectedIndex(-1);
        setFileArray([]);
        props.onCancel();
    }

    const onOk = function () {
        if (selectedIndex >= 0 && selectedIndex < fileArray.length) {
            props.onOk(props.type, fileArray[selectedIndex].file, fileArray[selectedIndex].name);
            setSelectedIndex(-1);
        }
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

export default DialogSimpleOpenfile