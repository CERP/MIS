import React, { useState } from 'react'
import clsx from 'clsx'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { WhiteAvatar, PaginationArrow } from 'assets/icons'

interface P {
	filtered_students: MISStudent[]
	targeted_instruction: RootReducerState['targeted_instruction']

	setType: (type: Types) => void
	setSelectedStd: (std: MISStudent) => void
}

type PropsType = P & RouteComponentProps

enum Types {
	SKILL_VIEW,
	CHILD_VIEW,
	SINGLE_STD_VIEW,
	SINGLE_SLO_VIEW
}

const ChildView: React.FC<PropsType> = ({
	filtered_students,
	targeted_instruction,
	match,
	setType,
	setSelectedStd
}) => {
	const { class_name, subject } = match.params as Params
	const [page_num, setPageNum] = useState(0)
	let quiz_result = {}
	filtered_students.slice(0, 1).map(std => {
		quiz_result = std?.targeted_instruction.quiz_result?.[class_name]?.[subject]
	})
	let array_length = Math.ceil(Object.keys(quiz_result || {}).length / 3)

	let no_of_pages = [...new Array(array_length).keys()]

	const getQuizTitles = () => {
		let quiz_ids = filtered_students.reduce((agg, std) => {
			return [
				...agg,
				...Object.keys(
					std?.targeted_instruction?.quiz_result?.[class_name]?.[subject] ?? {}
				)
			]
		}, [])
		return [...new Set(quiz_ids)].sort((a, b) => a.localeCompare(b))
	}

	return (
		<div className="w-full">
			<div className="bg-blue-tip-brand text-white flex flex-row justify-between items-center w-full py-2">
				<div className="w-1/3 flex justify-center font-bold">Names</div>
				<div className="w-2/3 flex flex-row justify-start md:mr-5">
					{getQuizTitles()
						.slice(page_num * 3, (page_num + 1) * 3)
						.map(quiz_id => {
							const quiz_title =
								targeted_instruction?.quizzes?.[class_name]?.[subject][quiz_id]
									?.quiz_title
							const quiz_order =
								targeted_instruction?.quizzes?.[class_name]?.[subject]?.[quiz_id]
									?.quiz_order
							return (
								<div
									key={quiz_id}
									className="text-white flex flex-col justify-start text-center text-xs md:text-sm lg:text-base w-1/3">
									<div>Quiz {quiz_order}</div>
									<div>{quiz_title}</div>
								</div>
							)
						})}
				</div>
			</div>
			<div className="mb-16 overflow-y-auto h-96">
				{filtered_students.map(std => {
					const quiz_result =
						std.targeted_instruction.quiz_result?.[class_name]?.[subject]
					array_length = Math.ceil(Object.keys(quiz_result || {}).length / 3)
					return (
						<div
							key={std.id}
							className="flex flex-row justify-between w-full items-center bg-gray-100 mb-1"
							onClick={() => (setType(Types.SINGLE_STD_VIEW), setSelectedStd(std))}>
							<div className="w-1/3 flex justify-center items-center">
								<div className="flex flex-row w-full md:w-3/5 lg:w-1/2 items-center">
									<img className="h-10 w-10 mr-2" src={WhiteAvatar} />
									<div className="flex flex-col justify-between">
										<div className="font-bold">{std.Name}</div>
										<div className="">{std.RollNumber}</div>
									</div>
								</div>
							</div>
							<div className="w-2/3 flex flex-row justify-start ml-2 md:ml-4 space-x-4 md:space-x-10">
								{Object.entries(quiz_result || {})
									.slice(page_num * 3, (page_num + 1) * 3)
									.sort(([a], [b]) => a.localeCompare(b))
									.map(([quiz_id, quiz]) => {
										const percentage =
											(quiz.obtained_marks / quiz.total_marks) * 100
										return (
											<div
												key={quiz_id}
												className={clsx(
													'flex flex-row justify-center items-center py-4 px-1 h-10 w-1/4',
													{
														'bg-green-250': percentage >= 75,
														'bg-yellow-250':
															percentage < 75 && percentage >= 40
													},
													'bg-red-250'
												)}>
												{percentage >= 0 ? `${percentage}%` : '-'}
											</div>
										)
									})}
							</div>
						</div>
					)
				})}
			</div>
			<div className="bg-gray-100 h-16 px-2 fixed w-full flex items-center bottom-0 justify-between">
				<div className="flex flex-row justify-start items-center">
					<div className="font-bold text-sea-green-tip-brand text-lg md:text-base lg:text-lg">
						Pages
					</div>
					{no_of_pages.map(no => (
						<div
							key={no}
							className={`${no === page_num
									? 'bg-sea-green-tip-brand text-white'
									: 'text-sea-green-tip-brand bg-white'
								} cursor-pointer shadow-lg ml-5 rounded-md bg-white py-2 px-4 border-solid border-sea-green-tip-brand`}
							onClick={() => setPageNum(no)}>
							{no + 1}
						</div>
					))}
				</div>
				<img className="w-6 h-6 mr-5" src={PaginationArrow} />
			</div>
		</div>
	)
}

export default withRouter(ChildView)
