import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import { Download, Printer, BlueDownload } from 'assets/icons'
import PDFViewer from 'pdf-viewer-reactjs'
import { getPDF } from 'utils/TIP'
import Card from './Card'
interface P {
	targeted_instruction: RootReducerState["targeted_instruction"]
}

type PropsType = P & RouteComponentProps

const PDF: React.FC<PropsType> = ({ match, targeted_instruction }) => {

	const url = (match.url).split('/')
	const [btn_type, setBtnType] = useState('teaching_material')
	const { class_name, subject, section_id, lesson_number } = match.params as Params
	const [test_id, pdf_url] = useMemo(() => getPDF(subject, class_name, targeted_instruction, (url[2].split("-")[0]).charAt(0).toUpperCase() + url[2].split("-")[0].slice(1)), [subject]);

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
		{url[2] === 'lesson-plans' ?
			<div className="w-full bg-gray-100 mt-3 rounded-2xl h-full">
				<div className="m-2">
					<div className="w-full flex flex-row justify-around">
						<button
							className={`border-none text-blue-300 text-xs bg-transparent outline-none
                   ${btn_type === 'teaching_material' && "text-blue-900 underline"}`}
							onClick={() => setBtnType('teaching_material')}>Teaching Material
               </button>
						<button
							className={`border-none text-blue-300 text-xs bg-transparent outline-none 
                   ${btn_type === 'activities' && "text-blue-900 underline"}`}
							onClick={() => setBtnType('activities')}>Activities
               </button>
						<button
							className={`border-none text-blue-300 text-xs bg-transparent outline-none 
                   ${btn_type === 'teaching_manual' && "text-blue-900 underline"}`}
							onClick={() => setBtnType('teaching_manual')}>Teaching Manual
               </button>
					</div>
					<div className="bg-white p-2 my-3 rounded-md mb-2 flex flex-row justify-between">
						<div className="text-blue-900 text-xs break-all	mr-3">
							{btn_type === 'teaching_material' ? targeted_instruction.curriculum[parseInt(class_name)] && targeted_instruction.curriculum[parseInt(class_name)][subject][parseInt(lesson_number)].material_links :
								btn_type === 'activities' ? targeted_instruction.curriculum[parseInt(class_name)] && targeted_instruction.curriculum[parseInt(class_name)][subject][parseInt(lesson_number)].activity_links :
									targeted_instruction.curriculum[parseInt(class_name)] && targeted_instruction.curriculum[parseInt(class_name)][subject][parseInt(lesson_number)].teaching_manual_link}
						</div>
						<div className="flex justify-center items-center">
							<img className="h-4 w-4" src={BlueDownload} />
						</div>
					</div>
				</div>
			</div> :
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
		}
	</div>
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(withRouter(PDF))
