import React, { useState } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Download, Printer, BlueDownload } from 'assets/icons'
import { downloadPdf } from 'utils/TIP'
import Card from '../Card'
import Dynamic from '@cerp/dynamic'
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
	const [btn_type, setBtnType] = useState('teaching_manual')
	const { class_name, subject, lesson_number } = match.params

	const lesson = targeted_instruction.curriculum[class_name][subject][lesson_number]
	//filter function removing empty strings from array
	let links = lesson.teaching_manual_link.split(/[\r\n]+/).filter(Boolean)
	if (btn_type === 'activities') {
		links = lesson.activity_links.split(/[\r\n]+/).filter(Boolean)
	}
	if (btn_type === 'teaching_material') {
		links = lesson.material_links.split(/[\r\n]+/).filter(Boolean)
	}

	// by default, we have pdf_url coming for curriculum
	let pdf_url = Dynamic.get<string>(targeted_instruction, [
		'curriculum',
		class_name,
		subject,
		lesson_number,
		'lesson_link'
	])

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
				class_name={class_name}
				subject={subject}
				lesson_name={lesson.lesson_title}
				lesson_no={lesson_number}
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
						onClick={() => downloadPdf(lesson.lesson_title, pdf_url)}>
						<img className="h-5 w-5" src={Download} />
					</div>
				</div>
			</div>
			<div className="w-full bg-gray-100 mt-3 rounded-2xl h-full">
				<div className="m-2">
					<div className="w-full flex flex-row justify-around">
						<button
							className={`border-none text-blue-300 text-xs bg-transparent outline-none 
                        ${btn_type === 'teaching_manual' && 'text-blue-900 underline'}`}
							onClick={() => setBtnType('teaching_manual')}>
							Teaching Manual
						</button>
						<button
							className={`border-none text-blue-300 text-xs bg-transparent outline-none 
                        ${btn_type === 'teaching_material' && 'text-blue-900 underline'}`}
							onClick={() => setBtnType('teaching_material')}>
							Teaching Material
						</button>
						<button
							className={`border-none text-blue-300 text-xs bg-transparent outline-none 
                        ${btn_type === 'activities' && 'text-blue-900 underline'}`}
							onClick={() => setBtnType('activities')}>
							Activities
						</button>
					</div>
					{links.length > 0 ? (
						links.map((link, index) => {
							return (
								<div
									key={index}
									className="bg-white p-2 my-3 rounded-md mb-2 flex flex-row justify-between">
									<a
										className="text-blue-900 text-xs break-all mr-3"
										href={link}
										target="_blank"
										rel="noopener noreferrer">
										{decodeURIComponent(link).split('/').slice(-1)}
									</a>
									{btn_type !== 'activities' && (
										<div
											className="flex justify-center items-center"
											onClick={() => downloadPdf(lesson.lesson_title, link)}>
											<img className="h-4 w-4" src={BlueDownload} />
										</div>
									)}
								</div>
							)
						})
					) : (
						<div className="bg-white p-2 my-3 rounded-md mb-2 flex flex-row justify-between text-blue-900">
							{`There are no ${btn_type.replace('/_/g', ' ')} for this lesson plan`}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default connect((state: RootReducerState) => ({
	targeted_instruction: state.targeted_instruction
}))(withRouter(PDF))
