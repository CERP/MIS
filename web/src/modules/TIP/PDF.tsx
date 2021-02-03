import React from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import { Download, Printer } from 'assets/icons'
import PDFViewer from 'pdf-viewer-reactjs'
import Card from './Card'
interface P {
	targeted_instruction: RootReducerState["targeted_instruction"]
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

	const url = (match.url).split('/')
	const { class_name, subject, section_id } = match.params

	// if test, this will find the test_id
	let test_type: TIPTestType = "Diagnostic"
	if (url[2].indexOf('summative') >= 0) {
		test_type = 'Summative'
	}
	if (url[2].indexOf('formative') >= 0) {
		test_type = 'Formative'
	}
	const test_ids = Object.entries(targeted_instruction.tests)
		.filter(([, t]) => t.type === test_type && t.subject === subject && t.grade === class_name)
		.map(([t_id,]) => t_id)

	const test_id = test_ids.length > 0 ? test_ids[0] : "dummy"

	let pdf_url
	// if we have a test, we need to chagne pdf_url to load from the test_id
	if (url[2].indexOf('test') >= 0) {
		pdf_url = targeted_instruction.tests[test_id].pdf_url
	}

	return <div className="flex flex-wrap flex-col content-between w-full items-center justify-items-center">
		<Card class_name={class_name} subject={subject} />
		<div className="rounded-lg border-black">
			<PDFViewer
				scale={0.5}
				scaleStep={0.1}
				maxScale={1}
				minScale={0.1}
				hideNavbar={true}
				canvasCss='customCanvas'
				document={{
					url: decodeURIComponent(pdf_url),
				}}
			/>
			<div className="flex flex-row justify-between my-4 w-full">
				<div className="bg-blue-150 rounded-full flex justify-center items-center h-12 w-12 ml-3"
					onClick={() => window.print()}>
					<img className="h-5 w-5" src={Printer} />
				</div>
				<div className="bg-blue-150 rounded-full flex justify-center items-center h-12 w-12 mr-3">
					<img className="h-5 w-5" src={Download} />
				</div>
			</div>
		</div>
		<div className="flex flex-row justify-around my-4 w-full">
			<div className="w-1/7">
				<button className="bg-green-primary font-bold text-lg border-none rounded-md text-white text-left p-2 w-full focus:outline-none">Answer Sheet</button>
			</div>
			<div className="w-1/7">
				<Link className="no-underline" to={url[2] === "diagnostic-test" ?
					`/${url[1]}/${url[2]}/${section_id}/${class_name}/${subject}/${test_id}/insert-grades` :
					`/${url[1]}/${url[2]}/${class_name}/${subject}/${test_id}/insert-grades`}>
					<button className="bg-blue-150 font-bold text-lg border-none rounded-md text-white text-left p-2 w-full focus:outline-none">
						Insert Grades
						</button>
				</Link>
			</div>
		</div>
	</div>
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(withRouter(PDF))
