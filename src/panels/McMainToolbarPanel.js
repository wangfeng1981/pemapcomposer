import React from 'react'

import { Container, 
    Row, Col, Button,
     Image, Dropdown,DropdownButton } from 'react-bootstrap';



import './panels.css';


/// props.onOpen
/// props.onSave
/// props.onExport
/// props.onRefresh
/// props.onAddVecLayer
/// props.onAddMap
/// props.onAddLabel
/// props.onAddRect
/// props.onAddEll
/// props.onAddArrow
/// props.onAddNorth
/// props.onAddScalebar
/// props.onAddLegend
/// props.onAddImage
/// props.onPageDirection('h'/'v') 
/// props.onQuit
/// props.currentPageDirection
function McMainToolbarPanel(props) {

    const buttonClickHandle = function () {

    }


    return (
        <div
            className="HeaderToolbarPanelDiv"
        >
            <Container fluid style={{ paddingTop: '12px' }}>
                <Row>
                    <Col md='1' >
                        <Button variant="outline-secondary" size="sm" 
                        onClick={props.onOpen}>
                            <Image src="./images/mc/open.png" />打开
                        </Button>
                    </Col>
                    <Col md='2' >
                        {/* <Button variant="outline-secondary" size="sm"
                        onClick={props.onSave}>
                            <Image src="./images/mc/save.png" />保存
                        </Button> */}
                        {/* <Button variant="outline-secondary" size="sm">
                            <Image src="./images/mc/saveas.png" />另存为
                        </Button> */}
                        
                        <Button variant="outline-secondary" size="sm" 
                        onClick={props.onRefresh}>
                            <Image src="./images/mc/copy.png" />刷新
                        </Button>

                        <Button variant="outline-secondary" size="sm" 
                        onClick={props.onExport}>
                            <Image src="./images/mc/export.png" />导出
                        </Button>
                    </Col>


                    <Col md='3'  >
                        <Button variant="outline-secondary" size="sm"
                        onClick={props.onAddVecLayer}>
                            <Image src="./images/mc/addvec.png" />添加矢量
                        </Button>

                        <Button variant="outline-secondary" size="sm"
                        onClick={props.onAddMap}>
                            <Image src="./images/mc/addmap.png" />添加地图
                        </Button>
                        <Button variant="outline-secondary" size="sm"
                        onClick={props.onAddLabel}>
                            <Image src="./images/mc/addtext.png" />添加文本
                        </Button>

                        <DropdownButton
                            variant="light"
                            style={{display:'inline',backgroundColor:'#fff'}}
                            title="添加形状"
                            size="sm"
                        >
                            <Dropdown.Item 
                            onClick={props.onAddRect}
                            >矩形</Dropdown.Item>
                            <Dropdown.Item 
                            onClick={props.onAddEll}
                            >圆形</Dropdown.Item>
                            {/* <Dropdown.Item 
                            onClick={props.onAddArrow}
                            >箭头</Dropdown.Item> */}
                        </DropdownButton>
                    </Col>
                    <Col md='3'>
                        <Button variant="outline-secondary" size="sm"
                        onClick={props.onAddNorth}
                        >
                            <Image src="./images/mc/addnorth.png" />指北针
                        </Button>
                        <Button variant="outline-secondary" size="sm"
                        onClick={props.onAddScalebar}
                        >
                            <Image src="./images/mc/ruler.png" />比例尺
                        </Button>
                        <Button variant="outline-secondary" size="sm"
                        onClick={props.onAddLegend}
                        >
                            <Image src="./images/mc/legend.png" />图例
                        </Button>
                        <Button variant="outline-secondary" size="sm"
                        onClick={props.onAddImage}
                        >
                            <Image src="./images/mc/addimg.png" />图片
                        </Button>
                    </Col>
                    <Col md='2'>
                        <select className="form-select-sm"  >
                            <option>纸张:A4</option>
                        </select>
                        <select className="form-select-sm"
                        value={props.currentPageDirection}
                        onChange={(e)=>props.onPageDirection(e.target.value)}
                        >
                            <option value='h' >横向</option>
                            <option value='v' >纵向</option>
                        </select>
                    </Col>


                    <Col>
                        {/* <Button variant="outline-secondary" size="sm"
                        onClick={props.onQuit}
                        >
                            <Image src="./images/mc/quit.png" />退出
                        </Button>
                        <Image style={{ marginLeft: '6px' }}
                            roundedCircle src="./images/mc/user.png" /> */}
                    </Col>


                </Row>

            </Container>

        </div>
    )
}

export default McMainToolbarPanel