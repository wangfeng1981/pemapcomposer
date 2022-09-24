import React , {useState,useEffect} from 'react'
import { Button, Card } from 'react-bootstrap';
import './panels.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DialogLayerProperty from '../dialogs/DialogLayerProperty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faTrashCan,faExpand,faCompress,faHand,faBan } from '@fortawesome/free-solid-svg-icons';


// props.layoutItemArray 
// props.onLayoutItemEdit
// props.onLayoutItemDelete
// onMapItemEnableInner 
// onMapItemDisableInner 
// onMapItemZoomIn
// onMapItemZoomOut
// currentInnerMovingMapUuid
function MapItemPanel(props) {

    const onDragEnd = function () {

    }

    const onMapItemEnableInner = function(item){
        props.onMapItemEnableInner(item.layoutitem.uuid) ;
    }

    const onMapItemDisableInner = function(mapuuid){
        props.onMapItemDisableInner(mapuuid) ;
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
            <div className="PanelItemListContainer2">

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}

                            >
                                {props.layoutItemArray.map((item, index) => (
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
                                                    <div>{item.layoutitem.name}</div>
                                                    {
                                                        (item.layoutitem.loitype === 'map' && 
                                                        props.currentInnerMovingMapUuid!==item.layoutitem.uuid ) ? (
                                                            <>
                                                            <Button size="sm" variant="outline-secondary"
                                                                onClick={() => onMapItemEnableInner(item)}>
                                                                <FontAwesomeIcon icon={faHand} color="dark" />
                                                            </Button>
                                                            <Button size="sm" variant="outline-secondary"
                                                            onClick={()=>onZoomIn(item)}
                                                            >
                                                                <FontAwesomeIcon icon={faExpand} color="dark" />
                                                            </Button>
                                                            <Button size="sm" variant="outline-secondary"
                                                            onClick={()=>onZoomOut(item)}
                                                            >
                                                                <FontAwesomeIcon icon={faCompress} color="dark" />
                                                            </Button>
                                                            </>
                                                            
                                                        ) : ""
                                                    }
                                                    {
                                                        (item.layoutitem.loitype === 'map'
                                                        && props.currentInnerMovingMapUuid===item.layoutitem.uuid) ? (
                                                            <Button size="sm" variant="outline-secondary"
                                                                onClick={() => onMapItemDisableInner(item.layoutitem.uuid)}>
                                                                <FontAwesomeIcon icon={faBan} color="dark" />
                                                            </Button>
                                                        ) : ""
                                                    }
                                                    <Button size="sm" variant="outline-secondary"
                                                        onClick={() => props.onLayoutItemEdit(item)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} color="dark" />
                                                    </Button>
                                                    <Button size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => props.onLayoutItemDelete(item)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashCan} color="dark" />
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