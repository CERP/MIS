import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from 'components/Layout'
import former from 'utils/former'
import Banner from 'components/Banner'
import {getSectionsFromClasses} from 'utils/getSectionsFromClasses';

import { promoteClass } from 'actions'


class Promotion extends Component {

    constructor(props) {
        super(props)

        this.state = {
            promoteFrom: "",
            promoteTo: "",
            filterOut: [],   // Id's of students that are not getting promoted :D
            banner: {
				active: false,
				good: true,
				text: "Saved!"
			}
        }
        this.former = new former(this,[])
    }

    onCheck = (e) => {
        if(!e.target.checked)
        {
            const arr = this.state.filterOut;
            arr.push(e.target.value)
            this.setState({
                filterOut : arr 
            })        
        }
        else {
            const arr = this.state.filterOut.filter(s_id => s_id !== e.target.value);
            this.setState({
                filterOut : arr 
            })
        }
    }

    onSave = () =>{

        const sections = getSectionsFromClasses(this.props.classes)
        .reduce( (obj, agg ) => {
            return {
                ...obj,
                [agg.id] : agg,
            }
        }, {})

        if(this.state.promoteFrom === "" || this.state.promoteTo === ""){
            return this.setState({
                banner: {
                    active: true,
                    good: false,
                    text: "Please Select both classes"
                }
            }), setTimeout(()=> {
                this.setState({
                    banner:{
                        active:false
                    }
                })
            },1000)
        }

        if(sections[this.state.promoteFrom].classYear > sections[this.state.promoteTo].classYear){
            return this.setState({
                banner: {
                    active: true,
                    good: false,
                    text: "Please Select a Higher order class to Promote"
                }
            }), setTimeout(()=> {
                this.setState({
                    banner:{
                        active:false
                    }
                })
            },1000)
        }
        console.log("Promoting", sections[this.state.promoteFrom], "To" , sections[this.state.promoteTo])

        this.props.promote(this.state.promoteFrom, this.state.promoteTo, this.state.filterOut)

        this.setState({
			banner: {
				active: true,
				good: true,
				text: "Promoted"
			}
		})

		setTimeout(() => {
			this.setState({
				banner: {
					active: false
				},
			})
		}, 2000);
    }
    render() {
        const {classes, students} = this.props;

        console.log("ENTRIES", 
        
        getSectionsFromClasses(classes)
            .reduce( (obj, agg ) => {
                return {
                    ...obj,
                    [agg.id] : agg,
                }
        }, {}))

        const items = Object.values(getSectionsFromClasses(classes))
            .sort((a, b) => (a.classYear || 0) - (b.classYear || 0))
            
        /* const sitems = getSectionsFromClasses(classes)
        .reduce( (obj, agg ) => {
            return {
                ...obj,
                [agg.id] : agg,
            }
        }, {})

        console.log("ITEMS", items)
         */
        const studentList = this.state.promoteFrom !== "" ? Object.values(students).filter(s => s.section_id === this.state.promoteFrom) : ""
            
        console.log("​render -> classes", classes)
        console.log("Promote From",this.state.promoteFrom)
        console.log("Promote To", this.state.promoteTo)        
        console.log("RENDER -> FILTER OUT",this.state.filterOut)

        return <Layout history={this.props.history}>
            <div className="promotion-module"> 
            { this.state.banner.active ? <Banner isGood={this.state.banner.good} text={this.state.banner.text} /> : false }  
                
                <div className="row">
                    <div className="row">
                        <label>From</label>
                        <select {...this.former.super_handle(["promoteFrom"])}>
                            <option value="" disabled>Select Class</option>
                            {items.map(s => {
                                return <option key={s.id} value={s.id}>{s.namespaced_name}</option>
                            })}
                        </select>
                    </div>
 
                    <div className="row">
                        <label>-></label>
                        <select {...this.former.super_handle(["promoteTo"])}>
                            <option value="" disabled>Select Class</option>
                            {items.map(s => 
                            {
                                return <option key={s.id} value={s.id}>{s.namespaced_name}</option>
                            })}
                        </select>
                    </div>

                    <div className="button blue" onClick={this.onSave}> Promote </div>
                </div>
                <div className="list">
                    {studentList !== "" ? studentList.length === 0 ? <div>No Students in Class</div> : studentList.map(s => {
                        return <div className="row" key={s.section_id + s.Name}>
                            <div>{s.Name} </div>
                            <input type="checkbox" value={s.id} onClick={this.onCheck} defaultChecked />
                        </div>
                    }): <div> Please Select a Class</div>}
                </div>

            </div>
        </Layout>
        
    }
}

export default connect((state) => ({
    classes: state.db.classes,
    students: state.db.students }), dispatch => ({ 
    promote: ( prevSectionId, newSectionId, filterOut ) => dispatch(promoteClass( prevSectionId, newSectionId, filterOut ))
}))(Promotion) 
