import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import { Download, Printer } from 'assets/icons'
import { downloadPdf } from 'utils/TIP'
import Card from './Card'
import { Viewer, RenderPageProps, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core'
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
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

const PDF: React.FC<PropsType> = ({ match, targeted_instruction }) => {
	const url = match.url.split('/')
	const { class_name, subject, section_id } = match.params

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

	const test_ids = Object.entries(targeted_instruction.tests)
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === class_name)
		.map(([t_id]) => t_id)

	const oral_test_ids = Object.entries(targeted_instruction.tests)
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === 'Oral Test')
		.map(([t_id]) => t_id)

	const quiz_ids = Object.entries(targeted_instruction.quizzes)
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === class_name)
		.map(([t_id]) => t_id)

	const test_id =
		test_ids.length > 0 ? test_ids[0] : quiz_ids.length > 0 ? quiz_ids[0] : oral_test_ids[0]

	let pdf_url = ''

	// if we have a test, we need to chagne pdf_url to load from the test_id
	if (test_type === 'Quiz') {
		pdf_url = targeted_instruction?.quizzes[test_id]?.pdf_url
	}

	if (url[2].indexOf('test') >= 0) {
		pdf_url = targeted_instruction?.tests[test_id]?.pdf_url
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
			<div className="flex flex-row justify-around my-4 w-full print:hidden">
				<div className="w-5/12">
					<Link
						className="no-underline"
						to={
							test_type === 'Diagnostic'
								? `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/answer-pdf`
								: url[2] === 'oral-test'
									? `/${url[1]}/${url[2]}/${subject}/answer-pdf`
									: `/${url[1]}/${url[2]}/${class_name}/${subject}/answer-pdf`
						}>
						<button className="bg-sea-green-tip-brand font-bold sm:text-sm md:text-base lg:text-lg border-none rounded-md text-white text-left p-3 md:p-2 lg:p-2 w-full focus:outline-none text-center">
							Answer Sheet
						</button>
					</Link>
				</div>
				<div className="w-5/12">
					<Link
						className="no-underline"
						to={
							test_type === 'Diagnostic'
								? `/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades`
								: url[2] === 'oral-test'
									? `/${url[1]}/${url[2]}/${subject}/${test_id}/insert-grades`
									: `/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades`
						}>
						<button className="bg-light-blue-tip-brand font-bold sm:text-sm md:text-base lg:text-lg border-none rounded-md text-white text-left p-3 md:p-2 lg:p-2 w-full focus:outline-none text-center">
							Insert Grades
						</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(withRouter(PDF))
