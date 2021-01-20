import React, { useState } from 'react';
import { getGradesFromTests } from 'utils/TIP'
import { connect } from 'react-redux'
import Headings from '../Headings'
import Classes from '../Classes'
import Card from '../Card'
import Subjects from '../Subjects'

interface P {
    classes: RootDBState["classes"]
    targeted_instruction: RootReducerState["targeted_instruction"]
}

const FormativeTest: React.FC<P> = (props) => {
    const [class_name, setClassName] = useState('');
    const grades = getGradesFromTests(props.targeted_instruction)

    return <div className="flex flex-wrap content-between">
        <Card class_name={class_name} />
        <Headings heading="Formative Test" sub_heading={class_name ? "Select the subject you want to evaluate" : "Select the Group tou want ot evaluate"} />
        {
            class_name ?
                <Subjects class_name={class_name} section_id='' /> :
                <Classes
                    setSectionId={setClassName}
                    sortedSections={null}
                    grades={grades}
                />
        }
    </div>
}

export default connect((state: RootReducerState) => ({
    classes: state.db.classes,
    targeted_instruction: state.targeted_instruction
}))(FormativeTest)

