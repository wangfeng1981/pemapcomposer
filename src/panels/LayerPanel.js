import React ,{useState,useEffect} from 'react'

import { Button, Card, Grid, Row, Col, Image , Form} from 'react-bootstrap';
import './panels.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



// onEditItem
// onRemoveItem
// props.layerArray
// props.themeArray
function LayerPanel(props) {


	const onDragEnd = function () {

	}

	const [currentVisibleLayerList, setCurrentVisibleLayerList] = useState([]) ;
	const [currentThemeName, setCurrentThemeName] = useState('') ;

	useEffect(() => {
		if( typeof props.themeArray !== 'undefined' && props.themeArray !== null 
		&& props.themeArray.length>0 )
		{
			const name1 = props.themeArray[0].name ;
			setCurrentThemeName(name1) ;
			updateLayerListByThemeName(name1) ;
		}
		
	}, [props.layerArray,props.themeArray])
	


	//private
	const updateLayerListByThemeName = function(themename){
		if( typeof props.themeArray === 'undefined' || props.themeArray===null)  return ;
		let themeObj = null ;
		for(let i=0;i<props.themeArray.length;++i)
		{
			if( props.themeArray[i].name === themename ){
				themeObj = props.themeArray[i] ;
				break;
			}
		}
		if( themeObj===null ) return ;
		const vislist = themeObj.vislyrid;
		let tempArr = [] ;
		for(let i = 0 ; i < props.layerArray.length; ++ i )
		{
			for(let j = 0 ; j<vislist.length;++j )
			{
				if( vislist[j] === props.layerArray[i].qlyrid )
				{
					tempArr.push(props.layerArray[i]) ;
					break ;
				}

			}
		}
		setCurrentVisibleLayerList(tempArr) ;
	}


	const onThemeChanged = function(ev) {
		const themeName1 = ev.target.value ;
		setCurrentThemeName(themeName1) ;
		updateLayerListByThemeName(themeName1) ;
	}


	return (
		<div
			className="VerticalPanelDiv1"
		>
			<div className="PanelHeader">
				<span>图层面板</span>
				{/* <Button basic style={{ float: 'right' }} onClick={props.onAddRect}>添加矢量图层</Button> */}
			</div>

			<div style={{padding:'6px'}}>
				<Form.Select onChange={onThemeChanged} value={currentThemeName} >
					{
						(typeof props.themeArray !== 'undefined' && props.themeArray!==null)?(
							props.themeArray.map( (item,index) => (
								<option key={'key'+index} value={item.name} >{item.name}</option>
							))
						):""
					}
					{/* <option value="1">One</option> */}
				</Form.Select>
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
								{currentVisibleLayerList.map((item, index) => (
									<Draggable key={'key'+index}
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