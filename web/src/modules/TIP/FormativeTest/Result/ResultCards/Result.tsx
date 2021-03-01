import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
//import { getStudentsByGroup, getResult, getClassResult, getPDF } from 'utils/TIP'
import Headings from '../../../Headings'
import ChildView from './ChildView'
import SkillView from './SkillView'
import SingleStdView from './SingleStdView'
import SingleSloView from './SingleSloView'
interface P {
	students: RootDBState["students"]
	targeted_instruction: RootReducerState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = (props) => {

	const url = props.match.url.split('/')
	const { class_name, subject, test_id } = props.match.params as Params
	const [id, setId] = useState('')
	const [name, setName] = useState('')
	const [slo, setSlo] = useState('')
	const [type, setType] = useState(url[2] === "formative-test" ? 'skill_view' : 'child_view')

	return <div>Page Not Available</div>


	/*
	//const group = class_name === "1" ? "blue" : class_name === "2" ? "yellow" : class_name === "3" ? "green" : "orange"
	const [testId,] = useMemo(() => getPDF(subject, class_name, props.targeted_instruction, (url[2].split("-")[0]).charAt(0).toUpperCase() + url[2].split("-")[0].slice(1)), [subject]);
	const group_students = useMemo(() => getStudentsByGroup(props.students, class_name as TIPGrades, subject), [subject])

	//const result: Result = useMemo(() => getResult(group_students, test_id ? test_id : testId, url[2] === "formative-result" ? url[2].replace("-result", "_result") : url[2].replace("-test", "_result")), [subject])
	const class_result: SloObj = useMemo(() => getClassResult(result), [])

	return <div className="flex flex-wrap content-between mt-3">
		<Headings heading={url[2] === "formative-test" ? "Midpoint Test Result" : "Final Test Result"} sub_heading="" />
		{type === 'single_std_view' ?
			url[2] === "summative-test" ? <div className="flex flex-row justify-center w-full" onClick={() => setType('child_view')}>
				<div className={`bg-${group}-primary h-6 my-3 w-3/4 rounded-3xl py-1 px-3 flex justify-center items-center`}>
					<img className="h-8 w-8 rounded-full pl-0 absolute left-7 top-14" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
					<div className="text-white flex justify-center capitalize">{`${name} | ${group} Group`}</div>
				</div>
			</div> : <div className="flex flex-row justify-center w-full" onClick={() => setType('child_view')}>
					<div className="bg-blue-tip-brand h-5 my-3 w-3/4 rounded-3xl py-1 px-3">
						<img className="h-7 w-8 rounded-full pl-0 absolute left-7 top-14" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
						<div className="text-white flex justify-center">Child View - {name}</div>
					</div>
				</div> :
			type === 'single_slo_view' ? <div className="flex flex-row justify-center items-center w-full" onClick={() => setType('skill_view')}>
				<div className="bg-blue-tip-brand h-5 my-3 w-3/4 rounded-3xl py-1 px-3">
					<img className="h-7 w-8 rounded-full pl-0 absolute left-7 top-14" src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300" alt="img" />
					<div className="text-white truncate ml-5 w-5/6">Skill View - {slo.replace('$', ',')}</div>
				</div>
			</div> : url[2] === "summative-test" ?
					<div className="flex flex-row justify-around w-full my-3 mx-6">
						<button className={`rounded-md text-white border-none bg-${group}-primary py-2 outline-none w-5/6 text-lg font-bold `}
						>Group {class_name}</button>
					</div> : <div className="flex flex-row justify-around w-full my-3 mx-6">
						<button className={type === 'skill_view' ? "border-none rounded-3xl text-white bg-blue-tip-brand py-1 px-6 outline-none" :
							"rounded-3xl text-blue-tip-brand broder border-solid border-blue-tip-brand py-1 px-6 bg-white outline-none"}
							onClick={() => setType('skill_view')}>Skill View</button>
						<button className={type === 'child_view' ? "border-none rounded-3xl text-white bg-blue-tip-brand py-1 px-6 outline-none" :
							"rounded-3xl text-blue-tip-brand broder border-solid border-blue-tip-brand py-1 px-6 bg-white outline-none"}
							onClick={() => setType('child_view')}>Child View</button>
					</div>
		}
		<div className={`flex flex-row ${type === 'child_view' ? "justify-around" : "justify-between px-8"} h-7 items-center text-white text-xs bg-blue-tip-brand w-full mb-1`}>
			{type === 'skill_view' && <>
				<div className="font-bold">skill</div>
				<div className="font-bold">Class Average</div>
			</>}
			{((type === 'child_view' || type === 'single_slo_view') && (url[2] === 'formative-test' || url[2] === 'formative-result')) && <>
				<div className="font-bold">Name</div>
				<div className="flex flex-row justify-between w-3/12 font-bold">
					<div>Score</div>
					<div>%</div>
				</div>
			</>}
			{(type === 'child_view' && url[2] === 'summative-test') && <>
				<div className="font-bold">Name</div>
				<div className="flex flex-row justify-between w-3/12 font-bold">
					<div>Status</div>
					<div>Score</div>
				</div>
			</>}
			{type === 'single_std_view' && <>
				<div className="font-bold">skill</div>
				<div className="flex flex-row justify-between w-3/12 font-bold">
					<div>Score</div>
					<div>%</div>
				</div>
			</>}
		</div>
		{
			type === 'skill_view' && url[2] !== "summative-test" &&
			Object.entries(class_result).map(([slo, obj]) => {
				return <SkillView key={slo} slo={slo.replace('$', ',')} obtain={obj.obtain} total={obj.total} setType={setType} setSlo={setSlo} />
			})
		}
		{
			type === 'single_slo_view' && url[2] !== "summative-test" &&
			Object.entries(result || {}).map(([std_id, res]) => {
				return <SingleSloView
					key={std_id}
					name={res.std_name}
					slo_obj={res.slo_obj}
					slo={slo}
				/>
			})
		}
		{
			(type === 'child_view') &&
			Object.entries(result || {}).map(([std_id, res]) => {
				return <ChildView
					key={std_id}
					name={res.std_name}
					obtain={res.obtain}
					total={res.total}
					std_id={std_id}
					test_type={url[2]}
					setId={setId}
					setName={setName}
					setType={setType} />
			})
		}
		{
			(type === 'single_std_view') &&
			Object.entries(result[id].slo_obj || {}).map(([slo, obj]) => {
				return <SingleStdView key={slo} slo={slo} obtain={obj.obtain} total={obj.total} />
			})
		}
	</div >
	*/
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	targeted_instruction: state.targeted_instruction
}))(withRouter(Result))