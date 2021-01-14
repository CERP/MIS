import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getStudentsBySectionId } from 'utils/TIP'
import Footer from '../Footer'
import Groups from './Groups'
import Card from '../Card'

interface P {
    students: RootDBState["students"]
}

interface DiagnosticRes {
    [level: string]: {
        group: string
        students: RootDBState["students"]
    }
}

type PropsType = P & RouteComponentProps

const Result: React.FC<PropsType> = (props) => {

    const { section_id, subject } = props.match.params as Params
    const [sub, setSub] = useState(subject)
    const students = useMemo(() => getStudentsBySectionId(section_id, props.students), [section_id])
    const result: DiagnosticRes = useMemo(() => calculateResult(students, sub), [sub])

    return <div className="flex flex-wrap content-between">
        <Card class_name="" />
        <div className="pb-16 w-full">
            {Object.entries(result)
                .map(([key, value]) => {
                    return <Groups key={key} color={`bg-${(value.group).toLowerCase()}-primary`} level={key} students={value.students} />
                })
            }
        </div>
        <Footer setSub={setSub} />
    </div>
}

export default connect((state: RootReducerState) => ({
    students: state.db.students
}))(withRouter(Result))


const calculateResult = (students: RootDBState["students"], sub: string) => {
    return Object.entries(students).reduce((agg, [std_id, std_obj]) => {
        const learning_level = std_obj.targeted_instruction.learning_level[sub]
        if (learning_level) {
            if (agg[learning_level.level]) {
                return {
                    ...agg,
                    [learning_level.level]: {
                        group: learning_level.group,
                        students: {
                            ...agg[learning_level.level].students,
                            [std_id]: std_obj
                        }
                    }
                }
            }
            return {
                ...agg,
                [learning_level.level]: {
                    group: learning_level.group,
                    students: {
                        [std_id]: std_obj
                    }
                }
            }
        }
        return { ...agg }
    }, {} as DiagnosticRes)
}