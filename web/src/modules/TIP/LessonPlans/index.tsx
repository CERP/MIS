import React, { useState, useMemo } from 'react';
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import { getClassnameFromSectionId } from 'utils/TIP'
import { connect } from 'react-redux'
import Headings from '../Headings'
import Classes from '../Classes'
import Card from '../Card'
import Subjects from '../Subjects'

interface P {
    classes: RootDBState["classes"]
}

const LessonPlans: React.FC<P> = (props) => {
    const [sectionId, setSectionId] = useState('');

    const sortedSections = useMemo(() => getSectionsFromClasses(props.classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0)), [])
    const class_name = useMemo(() => getClassnameFromSectionId(sortedSections, sectionId), [sectionId])

    return <div className="flex flex-wrap content-between">
        <Card class_name={class_name} />
        <Headings heading="Lesson Plans" sub_heading={class_name ? "Select the subject you want to evaluate" : "Select the class you want to evaluate"} {...props} />
        {
            class_name ?
                <Subjects class_name={class_name} section_id={sectionId} /> :
                <Classes
                    setSectionId={setSectionId}
                    sortedSections={sortedSections}
                />
        }
    </div>
}

export default connect((state: RootReducerState) => ({
    classes: state.db.classes
}))(LessonPlans)