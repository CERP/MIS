import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Download, Printer } from 'assets/icons'
import { downloadPdf } from 'utils/TIP'
import { Viewer, RenderPageProps, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core'
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode'
import Card from './Card'

interface P {
	targeted_instruction: RootReducerState['targeted_instruction']
}

type PropsType = P & RouteComponentProps<Params>

interface Params {
	class_name: TIPLevels
	subject: string
	section_id: string
	std_id: string
	test_id: string
	lesson_number: string
}

const AnswerSheet: React.FC<PropsType> = ({ match, targeted_instruction, history }) => {
	const url = match.url.split('/')
	const { class_name, subject } = match.params

	// if test, this will find the test_id
	let test_type: TIPTestType = 'Diagnostic'
	if (url[2].indexOf('summative') >= 0) {
		test_type = 'Summative'
	}
	if (url[2].indexOf('formative') >= 0) {
		test_type = 'Formative'
	}
	if (url[2].indexOf('quizzes') >= 0) {
		test_type = 'Quiz'
	}

	const test_ids = Object.entries(targeted_instruction.tests || {})
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === class_name)
		.map(([t_id]) => t_id)

	const oral_test_ids = Object.entries(targeted_instruction.tests || {})
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === 'Oral Test')
		.map(([t_id]) => t_id)

	const quiz_ids = Object.entries(targeted_instruction.quizzes?.[class_name]?.[subject] || {})
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === class_name)
		.map(([t_id]) => t_id)

	const test_id =
		test_ids.length > 0 ? test_ids[0] : quiz_ids.length > 0 ? quiz_ids[0] : oral_test_ids[0]

	let pdf_url = ''

	// if we have a test, we need to chagne pdf_url to load from the test_id
	if (url[2] === 'quizzes') {
		pdf_url = targeted_instruction?.quizzes?.[class_name]?.[subject]?.[test_id]?.pdf_url
	}

	if (url[2].indexOf('test') >= 0) {
		pdf_url = targeted_instruction?.tests[test_id]?.answer_pdf_url
	}

	const renderPage = (props: RenderPageProps) => {
		return (
			<>
				{props.svgLayer.children}
				{props.textLayer.children}
				{props.annotationLayer.children}
			</>
		)
	}

	const plugin_instance = scrollModePlugin()

	return (
		<div className="flex flex-wrap flex-col content-between w-full items-center justify-items-center mt-20">
			<Card
				class_name={class_name ? class_name : 'Oral Test'}
				subject={subject}
				lesson_name=""
				lesson_no=""
			/>
			<div className="border border-thin border-black rounded-md">
				<div className="rounded-lg h-96">
					<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
						<Viewer
							fileUrl={decodeURIComponent(pdf_url)}
							renderPage={renderPage}
							defaultScale={SpecialZoomLevel.PageFit}
							plugins={[plugin_instance]}
						/>
					</Worker>
				</div>
				<div className="flex flex-row justify-between my-4 w-full">
					<div
						className="bg-light-blue-tip-brand rounded-full flex justify-center items-center h-12 w-12 ml-3"
						onClick={() => window.print()}>
						<img className="h-5 w-5" src={Printer} />
					</div>
					<div
						className="bg-light-blue-tip-brand rounded-full flex justify-center items-center h-12 w-12 mr-3"
						onClick={() => downloadPdf(test_id, pdf_url)}>
						<img className="h-5 w-5" src={Download} />
					</div>
				</div>
			</div>
			<div className="w-full my-2">
				<div
					className="w-full no-underline flex justify-center items-center"
					onClick={() => history.goBack()}>
					<button className="bg-light-blue-tip-brand h-11 font-bold text-lg border-none rounded text-white p-2 w-11/12">
						Go back
					</button>
				</div>
			</div>
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(AnswerSheet)
