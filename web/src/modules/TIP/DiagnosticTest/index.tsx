import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { getSectionsFromClasses } from 'utils/getSectionsFromClasses'
import { getClassnameFromSectionId } from 'utils/TIP'
import Classes from '../Classes'
import Card from '../Card'
import Headings from '../Headings';
import Subjects from '../Subjects'

interface P {
    classes: RootDBState["classes"]
}

const DiagnosticTest: React.FC<P> = (props) => {
    const [sectionId, setSectionId] = useState('');

    const sorted_sections = useMemo(() => getSectionsFromClasses(props.classes).sort((a, b) => (a.classYear || 0) - (b.classYear || 0)), [])
    const class_name = useMemo(() => getClassnameFromSectionId(sorted_sections, sectionId), [sectionId])

    return <div className="flex flex-wrap content-between">
        <Card class_name={class_name} subject='' />
        <Headings
            heading="Diagnostic Test Result"
            sub_heading={class_name ? "Select the subject you want to evaluate" :
                "Select the class you want to evaluate"}
        />
        {class_name ?
            <Subjects class_name={class_name} section_id={sectionId} /> :
            <Classes
                setSectionId={setSectionId}
                sortedSections={sorted_sections}
                grades={null}
            />}
    </div>
}

export default connect((state: RootReducerState) => ({
    classes: state.db.classes
}))(DiagnosticTest)
