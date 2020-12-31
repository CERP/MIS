import React, { useState, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import { getClassnameFromSectionId } from 'utils/targetedInstruction'
import { connect } from 'react-redux'
import Headings from '../Headings'
import Classes from '../Classes'
import Card from '../Card'
import Subjects from '../Subjects'

interface P {
    classes: RootDBState["classes"]
}

type PropsType = P & RouteComponentProps

const LessonPlans: React.FC<PropsType> = (props) => {
    const [sectionId, setSectionId] = useState('');

    const sortedSections = useMemo(() => getSectionsFromClasses(props.classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0)), [])
    const className = useMemo(() => getClassnameFromSectionId(sortedSections, sectionId), [sectionId])

    return <div className="flex flex-wrap content-between">
        <Card {...props} className={className} />
        <Headings heading="Lesson Plans" subHeading={className ? "Select the subject you want to evaluate" : "Select the class you want to evaluate"} {...props} />
        {
            className ?
                <Subjects {...props} className={className} sectionId={sectionId} /> :
                <Classes {...props}
                    setSectionId={setSectionId}
                    sortedSections={sortedSections}
                />
        }
    </div>
}

export default connect((state: RootReducerState) => ({
    classes: state.db.classes,
    teacher_name: state.auth.name,
    school_name: state.auth.school_id,
}))(LessonPlans)