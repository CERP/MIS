import React,{Component} from 'react'
import { Link } from 'react-router-dom'
import Former from 'utils/former'

import './style.css'


class List extends Component {
	constructor(props) {
		super(props)
		this.state = {
			filterText : "",
			active: true,
			inActive: false,
			tag:""
		}
		this.former = new Former(this, [])
	}
	
	onChange = (e) => {
		this.setState({filterText:e.target.value});
	}

	uniqueTags = (students) => {

		const tags = new Set();

		Object.values(students)
			.forEach(s => {
				Object.keys(s.tags || {})
					.forEach(tag => tags.add(tag))
			})

		return tags;
	}

	getListFilterCondition = (item) =>{

		//Active is checked and inactive is unchecked
		if( this.state.active && !this.state.inActive && this.state.tag === "" ){
			return item.Active
			//Show only Active
		}

		//Active is checked and inactive is unchecked
		if( this.state.active && !this.state.inActive && this.state.tag !== "" ){

			if(item.tags === undefined){
				return false
			}
			return item.Active && Object.keys(item.tags).includes(this.state.tag)
			//Show active with selected tag
		}

		//Active is checked and inactive is checked
		if( this.state.active && this.state.inActive && this.state.tag === "" ){
			return true
			//show All
		}
		
		//Active is checked and inactive is checked
		if( this.state.active && this.state.inActive && this.state.tag !== "" ){

			if(item.tags === undefined){
				return false
			}
			return Object.keys(item.tags).includes(this.state.tag)
			//show all with selected tag
		}

		//Active is unchecked and inactive is checked
		if( !this.state.active && this.state.inActive && this.state.tag === "" ){
			return !item.Active
			//show only InActive
		}

		//Active is unchecked and inactive is checked
		if( !this.state.active && this.state.inActive && this.state.tag !== "" ){

			if(item.tags === undefined){
				return false
			}
			return !item.Active && Object.keys(item.tags).includes(this.state.tag)
			//Show InActive with selected tag
		}

	}

	render() {
		const {items, toLabel, Component, students } = this.props;

		
		const filteredList = items
			.filter(item => {
				return toLabel(item) !== undefined && toLabel(item).toLowerCase().includes(this.state.filterText.toLowerCase()) && this.getListFilterCondition(item)
			})
			.sort((a,b) => toLabel(b).localeCompare(this.state.filterText) - toLabel(a).localeCompare(this.state.filterText))

		const header = filteredList.some(i => i.header)

		return <div className="list-wrap">
			<div className="total">
				<div className="label">
					Total: <strong> { header ? filteredList.length -1 : filteredList.length } </strong>
				</div>
				{ this.props.create ? <Create to={this.props.create} text={this.props.createText} /> : false }
			</div>
			<input className="search-bar no-print" type="text" placeholder="Search" onChange={this.onChange}/>

			{ students && <div className="row filter-container">
					
					<div className="row checkbox-container">
						<div className="checkbox">
							<input type="checkbox" {...this.former.super_handle(["active"])} style={{height:"20px"}}/>
								Active
						</div>
						<div className="checkbox">
							<input type="checkbox" {...this.former.super_handle(["inActive"])} style={{height:"20px"}} />
								InActive
						</div>
					</div>

					<select className="list-select" {...this.former.super_handle(["tag"])}>
						<option value="">Tag</option>
						{
							[...this.uniqueTags(students).keys()]
							.filter(tag => tag !== "PROSPECTIVE")
							.map(tag => <option key={tag} value={tag}> {tag} </option>)
						}
					</select>
					
			</div>
			}

			<div className="list">
			{
				filteredList.map(item => Component(item))
			}
			
			</div>
		</div>
	}
}

const Create = ({ to, text}) => {
	return <Link className="button blue" to={to}>{text}</Link>
}

export default List;

