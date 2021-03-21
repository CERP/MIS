import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Headings from '../../../Headings'
import ChildView from './ChildView'
import SkillView from './SkillView'
import SingleStdView from './SingleStdView'
import SingleSloView from './SingleSloView'
import { DownArrow } from 'assets/icons'
import {
	getStudentsByGroup,
	getResult,
	getClassResult,
	getTestType,
	convertLearningGradeToGroupName,
	convertLearningLevelToGrade
} from 'utils/TIP'
interface P {
	students: RootDBState['students']
	targeted_instruction: RootReducerState['targeted_instruction']
}

type PropsType = P & RouteComponentProps

type OrderedGroupItem = {
	group: TIPGrades
	color: TIPLearningGroups
}

const ordered_groups: Array<OrderedGroupItem> = [
	{ group: 'KG', color: 'Blue' },
	{ group: '1', color: 'Yellow' },
	{ group: '2', color: 'Green' },
	{ group: '3', color: 'Orange' },
	{ group: 'Oral Test', color: 'Oral' },
	{ group: 'Not Needed', color: 'Remediation Not Needed' }
]

const Result: React.FC<PropsType> = props => {
	const url = props.match.url.split('/')
	const test_type = getTestType(url[2])

	const { class_name, subject } = props.match.params as Params

	const grade = convertLearningLevelToGrade(class_name)
	const group = convertLearningGradeToGroupName(grade).toLowerCase()

	const [display_dropdown, setDisplayDropdown] = useState(false)
	const [selected_group, setSelectedGroup] = useState<TIPGrades>(grade)
	const [id, setId] = useState('')
	const [name, setName] = useState('')
	const [slo, setSlo] = useState('')
	const [type, setType] = useState(test_type === 'Formative' ? 'skill_view' : 'child_view')

	const test_ids = Object.entries(props.targeted_instruction.tests)
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === class_name)
		.map(([t_id]) => t_id)

	const test_id = test_ids.length > 0 ? test_ids[0] : ''

	const group_students: MISStudent[] = useMemo(
		() => getStudentsByGroup(props.students, selected_group, subject),
		[selected_group]
	)
	console.log('stddd', group_students)
	const result: SLOBasedResult = useMemo(() => getResult(group_students, test_id), [
		subject,
		group_students
	])
	const class_result: SloObj = useMemo(() => getClassResult(result), [result])

	return (
		<div className="flex flex-wrap content-between mt-3">
			<Headings
				heading={test_type === 'Formative' ? 'Midpoint Test Result' : 'Final Test Result'}
				sub_heading=""
			/>
			{type === 'single_std_view' ? (
				test_type === 'Summative' ? (
					<div
						className="flex flex-row justify-center w-full"
						onClick={() => setType('child_view')}>
						<div
							className={`bg-${group}-tip-brand h-6 my-3 w-3/4 rounded-3xl py-1 px-3 flex justify-center items-center`}>
							<img
								className="h-8 w-8 rounded-full pl-0 absolute left-7 top-14"
								src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300"
								alt="img"
							/>
							<div className="text-white flex justify-center capitalize">{`${name} | ${group} Group`}</div>
						</div>
					</div>
				) : (
						<div
							className="flex flex-row justify-center w-full"
							onClick={() => setType('child_view')}>
							<div className="bg-blue-tip-brand h-5 my-3 w-3/4 rounded-3xl py-1 px-3">
								<img
									className="h-7 w-8 rounded-full pl-0 absolute left-7 top-14"
									src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300"
									alt="img"
								/>
								<div className="text-white flex justify-center">
									Child View - {name}
								</div>
							</div>
						</div>
					)
			) : type === 'single_slo_view' ? (
				<div
					className="flex flex-row justify-center items-center w-full"
					onClick={() => setType('skill_view')}>
					<div className="bg-blue-tip-brand h-5 my-3 w-3/4 rounded-3xl py-1 px-3">
						<img
							className="h-7 w-8 rounded-full pl-0 absolute left-7 top-14"
							src="https://cdn.dribbble.com/users/2199928/screenshots/11532918/shot-cropped-1590177932366.png?compress=1&resize=400x300"
							alt="img"
						/>
						<div className="text-white truncate ml-5 w-5/6">
							Skill View - {slo.replace('$', ',')}
						</div>
					</div>
				</div>
			) : test_type === 'Summative' ? (
				<>
					<div className="flex flex-row justify-center items-center w-full my-3 mx-6">
						<button
							className={clsx(
								'rounded-md text-white border-none py-2 outline-none w-5/6 text-lg font-bold',
								{
									'bg-gray-400': selected_group === 'Oral Test',
									'bg-gray-600': selected_group === 'Not Needed',
									'bg-blue-tip-brand': selected_group === 'KG',
									'bg-yellow-tip-brand': selected_group === '1',
									'bg-green-tip-brand': selected_group === '2',
									'bg-orange-tip-brand': selected_group === '3'
								}
							)}
							onClick={() => setDisplayDropdown(!display_dropdown)}>
							{convertLearningGradeToGroupName(selected_group)} Group
							<img
								className="right-16 md:right-24 lg:right-40 top-36 absolute"
								src={DownArrow}
							/>
						</button>
					</div>
					{display_dropdown && (
						<div className="w-full absolute top-44 flex justify-center">
							<div className="w-5/6  bg-white border border-black">
								{ordered_groups.map(ordered_group => (
									<div
										className="hover:bg-light-blue-tip-brand hover:text-white p-2 cursor-pointer"
										key={ordered_group.group}
										onClick={() => (
											setSelectedGroup(ordered_group.group),
											setDisplayDropdown(!display_dropdown)
										)}>
										{ordered_group.color} Group
									</div>
								))}
							</div>
						</div>
					)}
				</>
			) : (
							<div className="flex flex-row justify-around w-full my-3 mx-6">
								<button
									className={
										type === 'skill_view'
											? 'border-none rounded-3xl text-white bg-blue-tip-brand py-1 px-6 outline-none'
											: 'rounded-3xl text-blue-tip-brand broder border-solid border-blue-tip-brand py-1 px-6 bg-white outline-none'
									}
									onClick={() => setType('skill_view')}>
									Skill View
					</button>
								<button
									className={
										type === 'child_view'
											? 'border-none rounded-3xl text-white bg-blue-tip-brand py-1 px-6 outline-none'
											: 'rounded-3xl text-blue-tip-brand broder border-solid border-blue-tip-brand py-1 px-6 bg-white outline-none'
									}
									onClick={() => setType('child_view')}>
									Child View
					</button>
							</div>
						)}
			<div
				className={`flex flex-row ${type === 'child_view' ? 'justify-around' : 'justify-between px-8'
					} h-7 items-center text-white text-xs bg-blue-tip-brand w-full mb-1`}>
				{type === 'skill_view' && (
					<>
						<div className="font-bold">skill</div>
						<div className="font-bold">Class Average</div>
					</>
				)}
				{(type === 'child_view' || type === 'single_slo_view') &&
					(test_type === 'Formative' || url[2] === 'formative-result') && (
						<>
							<div className="font-bold">Name</div>
							<div className="flex flex-row justify-between w-3/12 font-bold">
								<div>Score</div>
								<div>%</div>
							</div>
						</>
					)}
				{type === 'child_view' && test_type === 'Summative' && (
					<>
						<div className="font-bold">Name</div>
						<div className="flex flex-row justify-between w-3/12 font-bold">
							<div>Status</div>
							<div>Score</div>
						</div>
					</>
				)}
				{type === 'single_std_view' && (
					<>
						<div className="font-bold">skill</div>
						<div className="flex flex-row justify-between w-3/12 font-bold">
							<div>Score</div>
							<div>%</div>
						</div>
					</>
				)}
			</div>
			{type === 'skill_view' &&
				test_type !== 'Summative' &&
				Object.entries(class_result).map(([slo, obj]) => {
					return (
						<SkillView
							key={slo}
							slo={slo.replace('$', ',')}
							obtain={obj.obtain}
							total={obj.total}
							setType={setType}
							setSlo={setSlo}
						/>
					)
				})}
			{type === 'single_slo_view' &&
				test_type !== 'Summative' &&
				Object.entries(result || {}).map(([std_id, res]) => {
					return (
						<SingleSloView
							key={std_id}
							name={res.std_name}
							slo_obj={res.slo_obj}
							slo={slo}
						/>
					)
				})}
			{type === 'child_view' &&
				Object.entries(result || {}).map(([std_id, res]) => {
					return (
						<ChildView
							key={std_id}
							name={res.std_name}
							obtain={res.obtain}
							total={res.total}
							std_id={std_id}
							test_type={test_type}
							setId={setId}
							setName={setName}
							setType={setType}
						/>
					)
				})}
			{type === 'single_std_view' &&
				Object.entries(result[id].slo_obj || {}).map(([slo, obj]) => {
					return (
						<SingleStdView key={slo} slo={slo} obtain={obj.obtain} total={obj.total} />
					)
				})}
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	students: state.db.students,
	targeted_instruction: state.targeted_instruction
}))(withRouter(Result))
