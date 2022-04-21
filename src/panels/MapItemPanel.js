import React , {useState,useEffect} from 'react'
import { Button, Card } from 'react-bootstrap';
import './panels.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DialogLayerProperty from '../dialogs/DialogLayerProperty';


// props.layoutItemArry 
// props.onLayoutItemEdit
// props.onLayoutItemDelete
// onMapItemEnableInner 
// onMapItemDisableInner 
// onMapItemZoomIn
// onMapItemZoomOut
function MapItemPanel(props) {

    // selectedMapItem.uuid, selectedMapItem.enabled=true/false
    const [selectedMapItem, setSelectedMapItem] = useState(null) ;

    const onDragEnd = function () {

    }

    const onMapItemEnableInner = function(item){
        let item1 = {} ;
        item1.uuid = item.layoutitem.uuid ;
        item1.enabled = true ;
        setSelectedMapItem(item1) ;
        props.onMapItemEnableInner(item) ;
    }

    const onMapItemDisableInner = function(item){
        setSelectedMapItem(null) ;
        props.onMapItemDisableInner(item) ;
    }

    const onZoomIn = function(loitem){
        props.onMapItemZoomIn(loitem) ;
    }

    const onZoomOut = function(loitem){
        props.onMapItemZoomOut(loitem) ;
    }


    return (
        <div
            className="VerticalPanelDiv2"
        >
            <div className="PanelHeader">地图元素面板</div>
            {/* item container */}
            <div className="PanelItemListContainer">

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}

                            >
                                {props.layoutItemArry.map((item, index) => (
                                    <Draggable key={index}
                                        draggableId={'did' + index}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}

                                            >
                                                <Card.Body>
                                                    <Card.Text>
                                                        {item.layoutitem.name}
                                                    </Card.Text>
                                                    {
                                                        (item.layoutitem.loitype === 'map' && selectedMapItem===null ) ? (
                                                            <>
                                                            <Button size="sm" variant="outline-secondary"
                                                                onClick={() => onMapItemEnableInner(item)}>
                                                                开启移动地图内容
                                                            </Button>
                                                            <Button size="sm" variant="outline-secondary"
                                                            onClick={()=>onZoomIn(item)}
                                                            >
                                                                放大
                                                            </Button>
                                                            <Button size="sm" variant="outline-secondary"
                                                            onClick={()=>onZoomOut(item)}
                                                            >
                                                                缩小
                                                            </Button>
                                                            </>
                                                            
                                                        ) : ""
                                                    }
                                                    {
                                                        (item.layoutitem.loitype === 'map'
                                                        && selectedMapItem!==null 
                                                        && selectedMapItem.uuid===item.layoutitem.uuid) ? (
                                                            <Button size="sm" variant="outline-secondary"
                                                                onClick={() => onMapItemDisableInner(item)}>
                                                                结束移动地图内容
                                                            </Button>
                                                        ) : ""
                                                    }
                                                    <Button size="sm" variant="outline-secondary"
                                                        onClick={() => props.onLayoutItemEdit(item)}>
                                                        编辑
                                                    </Button>
                                                    <Button size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => props.onLayoutItemDelete(item)}
                                                    >
                                                        删除
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

            </div>

        </div>
    )
}

export default MapItemPanel