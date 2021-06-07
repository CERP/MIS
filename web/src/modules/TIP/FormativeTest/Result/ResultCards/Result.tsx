import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import Headings from '../../../Headings'
import ChildView from './ChildView'
import SkillView from './SkillView'
import SingleStdView from './SingleStdView'
import SingleSloView from './SingleSloView'
import { WhiteAvatar } from 'assets/icons'
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

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const Result: React.FC<PropsType> = props => {
	const url = props.match.url.split('/')
	const test_type = getTestType(url[2])

	const { class_name, subject } = props.match.params as Params

	const grade: TIPGrades = convertLearningLevelToGrade(class_name)
	const group = convertLearningGradeToGroupName(grade).toLowerCase()

	const [id, setId] = useState('')
	const [name, setName] = useState('')
	const [slo, setSlo] = useState('')
	const [type, setType] = useState(
		test_type === 'Formative' ? Types.SKILL_VIEW : Types.CHILD_VIEW
	)

	const test_ids = Object.entries(props.targeted_instruction.tests)
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === class_name)
		.map(([t_id]) => t_id)

	const test_id = test_ids.length > 0 ? test_ids[0] : ''

	const group_students: MISStudent[] = useMemo(
		() => getStudentsByGroup(props.students, grade, subject),
		[grade]
	)

	const result: SLOBasedResult = useMemo(() => getResult(group_students, test_id), [
		subject,
		group_students
	])
	const class_result: SloObj = useMemo(() => getClassResult(result), [result])

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Headings
				heading={test_type === 'Formative' ? 'Midpoint Test Result' : 'Final Test Result'}
			/>
			{type === Types.SINGLE_STD_VIEW ? (
				test_type === 'Summative' ? (
					<div
						className="flex flex-row justify-center w-full cursor-pointer"
						onClick={() => setType(Types.CHILD_VIEW)}>
						<div
							className={clsx(
								'h-6 my-4 w-3/4 rounded-3xl py-1 pt-2 flex justify-center items-center',
								{
									'bg-gray-400': grade === 'Oral Test',
									'bg-gray-600': grade === 'Not Needed',
									'bg-blue-tip-brand': grade === 'KG',
									'bg-yellow-tip-brand': grade === '1',
									'bg-green-tip-brand': grade === '2',
									'bg-orange-tip-brand': grade === '3'
								}
							)}>
							<div className="absolute rounded-full w-3/4">
								<img
									className="h-9 w-9 rounded-full top-32"
									src={WhiteAvatar}
									alt="img"
								/>
							</div>
							<div className="text-white flex justify-center capitalize">{`${name} | ${group} Group`}</div>
						</div>
					</div>
				) : (
					<div
						className="flex flex-row justify-center w-full"
						onClick={() => setType(Types.CHILD_VIEW)}>
						<div className="bg-blue-tip-brand h-6 my-4 w-3/4 rounded-3xl py-1 pt-2 flex justify-center items-center cursor-pointer">
							<div className="absolute rounded-full w-3/4">
								<img className="h-9 w-9 rounded-full" src={WhiteAvatar} alt="img" />
							</div>
							<div className="text-white flex justify-center">
								Child View - {name}
							</div>
						</div>
					</div>
				)
			) : type === Types.SINGLE_SLO_VIEW ? (
				<div
					className="flex flex-row justify-center items-center w-full"
					onClick={() => setType(Types.SKILL_VIEW)}>
					<div className="bg-blue-tip-brand h-6 my-4 w-3/4 rounded-3xl py-1 pt-2 flex justify-center items-center cursor-pointer">
						<div className="absolute rounded-full w-3/4">
							<img className="h-9 w-9 rounded-full" src={WhiteAvatar} alt="img" />
						</div>
						<div className="text-sm md:text-md lg:text-lg text-white truncate w-full flex justify-center items-center">
							Skill View - {slo.replaceAll('$', ',')}
						</div>
					</div>
				</div>
			) : test_type === 'Summative' ? (
				<div className="flex flex-row justify-center items-center w-full my-3 mx-6">
					<button
						className={clsx(
							'rounded-md text-white border-none py-2 outline-none w-5/6 text-lg font-bold capitalize',
							{
								'bg-gray-400': grade === 'Oral Test',
								'bg-gray-600': grade === 'Not Needed',
								'bg-blue-tip-brand': grade === 'KG',
								'bg-yellow-tip-brand': grade === '1',
								'bg-green-tip-brand': grade === '2',
								'bg-orange-tip-brand': grade === '3'
							}
						)}>
						{group} Group
					</button>
				</div>
			) : (
				<div className="flex flex-row justify-around w-full my-3 mx-6">
					<button
						className={
							type === Types.SKILL_VIEW
								? 'border-none rounded-3xl text-white bg-blue-tip-brand py-2 px-6 outline-none'
								: 'rounded-3xl text-blue-tip-brand broder border-solid border-blue-tip-brand py-2 px-6 bg-white outline-none'
						}
						onClick={() => setType(Types.SKILL_VIEW)}>
						Skill View
					</button>
					<button
						className={
							type === Types.CHILD_VIEW
								? 'border-none rounded-3xl text-white bg-blue-tip-brand py-2 px-6 outline-none'
								: 'rounded-3xl text-blue-tip-brand broder border-solid border-blue-tip-brand py-2 px-6 bg-white outline-none'
						}
						onClick={() => setType(Types.CHILD_VIEW)}>
						Child View
					</button>
				</div>
			)}
			<div
				className={`flex flex-row ${type === Types.CHILD_VIEW ? 'justify-around' : 'justify-between px-8'
					} py-2 items-center text-white text-sm md:text-md lg:text-lg bg-blue-tip-brand w-full mb-1`}>
				{type === Types.SKILL_VIEW && (
					<>
						<div className="font-bold w-2/4">skill</div>
						<div className="font-bold w-2/4 text-right mr-5">Class Average</div>
					</>
				)}
				{type === Types.CHILD_VIEW &&
					(test_type === 'Formative' || url[2] === 'formative-result') && (
						<>
							<div className="font-bold w-2/4 flex justify-center md:justify-start lg:justify-start">
								<span className="pl-0 md:pl-14 lg:pl-14">Name</span>
							</div>
							<div className="flex flex-row justify-around w-2/4 font-bold text-sm md:text-md lg:text-lg">
								<div className="w-9/12 flex flex-row justify-around">
									<div>Score</div>
									<div>%</div>
								</div>
								<div className="w-3/12"></div>
							</div>
						</>
					)}
				{type === Types.SINGLE_SLO_VIEW &&
					(test_type === 'Formative' || url[2] === 'formative-result') && (
						<>
							<div className="font-bold w-2/4 flex justify-start md:justify-start lg:justify-start">
								<span className="pl-0 md:pl-14 lg:pl-14">Name</span>
							</div>
							<div className="w-3/12 flex flex-row justify-between font-bold text-sm md:text-md lg:text-lg">
								<div>Score</div>
								<div>%</div>
							</div>
						</>
					)}
				{type === Types.CHILD_VIEW && test_type === 'Summative' && (
					<>
						<div className="font-bold">Name</div>
						<div className="flex flex-row justify-between w-3/12 font-bold text-sm md:text-md lg:text-lg">
							<div>Status</div>
							<div>Score</div>
						</div>
					</>
				)}
				{type === Types.SINGLE_STD_VIEW && (
					<>
						<div className="font-bold">skill</div>
						<div className="flex flex-row justify-between w-3/12 font-bold text-sm md:text-md lg:text-lg">
							<div>Score</div>
							<div>%</div>
						</div>
					</>
				)}
			</div>
			{type === Types.SKILL_VIEW &&
				test_type !== 'Summative' &&
				Object.entries(class_result).map(([slo, obj]) => {
					return (
						<SkillView
							key={slo}
							slo={slo.replaceAll('$', ',')}
							obtain={obj.obtain}
							total={obj.total}
							setType={setType}
							setSlo={setSlo}
						/>
					)
				})}
			{type === Types.SINGLE_SLO_VIEW &&
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
			{type === Types.CHILD_VIEW &&
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
			{type === Types.SINGLE_STD_VIEW &&
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
}))(Result)
