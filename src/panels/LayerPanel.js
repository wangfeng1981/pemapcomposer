import React from 'react'

import { Button, Card, Grid, Row, Col, Image } from 'react-bootstrap';
import './panels.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



// onEditItem
// onRemoveItem
// props.layerArray
function LayerPanel(props) {




	const onDragEnd = function () {

	}




	return (
		<div
			className="VerticalPanelDiv1"
		>
			<div className="PanelHeader">
				<span>图层面板</span>
				{/* <Button basic style={{ float: 'right' }} onClick={props.onAddRect}>添加矢量图层</Button> */}
			</div>

			{/* item container */}
			<div className="PanelItemListContainer">
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}

							>
								{props.layerArray.map((item, index) => (
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
														<Row>
															{
																(item.type === 'vec') ? (
																	<Col sm='auto'>
																		{
																			(item.type2 === 1) ? <Image width="24" src='./images/mc/vec-point.png' /> : ""
																		}
																		{
																			(item.type2 === 2) ? <Image width="24" src='./images/mc/vec-line.png' /> : ""
																		}
																		{
																			(item.type2 === 3) ? <Image width="24" src='./images/mc/vec-poly.png' /> : ""
																		}
																	</Col>
																) : ""
															}
															{
																(item.type === 'wms') ? (
																	<Col sm='auto'>
																		<Image width="24" src='./images/mc/wmts-layer.png' />
																	</Col>
																) : ""
															}
															<Col>{item.name}</Col>
														</Row>
													</Card.Text>
													{
														(item.type === 'vec') ? (
															<Button size="sm" variant="outline-secondary"
																onClick={() =>
																	props.onEditItem(item)}>
																编辑
															</Button>
														) : ""
													}
													<Button size="sm"
														variant="outline-danger"
														onClick={() =>
															props.onRemoveItem(item)}
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

export default LayerPanel