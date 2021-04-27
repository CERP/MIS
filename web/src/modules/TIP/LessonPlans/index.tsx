import React, { useState } from 'react'
import Headings from '../Headings'
import Levels from '../Levels'
import Card from '../Card'
import Subjects from '../Subjects'

interface P { }

const LessonPlans: React.FC<P> = () => {
	const [class_name, setClassName] = useState('')

	return (
		<div className="flex flex-wrap content-between mt-20">
			<Card class_name={class_name} />
			<Headings
				heading="Lesson Plans"
				sub_heading={
					class_name ? 'Select the subject you want to evaluate' : 'Select the Group'
				}
			/>
			{class_name ? (
				<Subjects class_name={class_name} section_id="" />
			) : (
				<Levels setSectionId={setClassName} />
			)}
		</div>
	)
}

export default LessonPlans
