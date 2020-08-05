import React, { useState, useEffect, useMemo } from "react"
import { connect } from 'react-redux'

import { fetchLessons } from 'actions/core'
import { showScroll, hideScroll } from "utils/helpers"
import { PlayIcon } from 'assets/icons'
import { ContentCopyIcon } from 'assets/icons'
import moment from 'moment'

import './style.css'

interface PropsType {
    students: RootDBState["students"]
    classes: RootDBState["classes"]
    events: RootDBState["ilmx"]["events"]
    lessons: RootDBState["ilmx"]["lessons"]
    isLoading: boolean
    hasError: boolean
    fetchLessons: () => void
}

interface S {
    showViewerModal: boolean
    lessonId: string
    scrollY: number
}

const SubjectTable: React.FC<PropsType> = ({ students, events, lessons, fetchLessons, classes }) => {

    const current_date = moment.now()

    const [toggleSortOrder, setToggleSortOrder] = useState(false)
    const [classFilter, setClassFilter] = useState('')
    const [subjectFilter, setSubjectFilter] = useState('')
    const [dateFilter, setDateFilter] = useState(null)
    const [, setCopied] = useState(false)

    useEffect(() => {
        fetchLessons()
    }, [fetchLessons])

    const { classTitles, subjects } = useMemo(() => getClassSubjectsInfo(events), [events])
    const lessons_data = useMemo(
        () => computeLessonsData(events, lessons, dateFilter, classFilter, subjectFilter),
        [events, lessons, dateFilter, classFilter, subjectFilter]
    )

    const sorted_entries = getSortedEntries(lessons_data, toggleSortOrder)

    const [stateProps, setStateProps] = useState<S>({
        showViewerModal: false,
        lessonId: "",
        scrollY: 0,
    })

    const handleClickShowViewers = (lesson_id: string) => {
        const scrollY = window.pageYOffset
        setStateProps({
            ...stateProps,
            showViewerModal: !stateProps.showViewerModal,
            lessonId: lesson_id,
            scrollY: scrollY
        })

        hideScroll()
    }

    const copyLink = (link: string) => {
        navigator.clipboard.writeText(link)
    }

    return (
        <div className="ilmx-analytics section-container">
            <div className="text-left heading" style={{ marginTop: 4, fontWeight: 700, marginBottom: "1rem", fontSize: "1.25rem" }}>Related Video Lectures</div>
            <div className="section">
                <div className="row video-filter">
                    <select onChange={(e) => setClassFilter(e.target.value)}>
                        <option value="">Select Class</option>
                        {
                            classTitles
                                .sort()
                                .reverse()
                                .sort((a, b) => {
                                    if (parseInt(a) && parseInt(b)) return +a - +b
                                    if (parseInt(a) && !parseInt(b)) return 1
                                    if (parseInt(b) && !parseInt(b)) return -1
                                    return 0
                                })
                                .map(c_title => <option key={c_title} value={c_title}>Class {c_title}</option>)
                        }
                    </select>
                    <select onChange={(e) => setSubjectFilter(e.target.value)}>
                        <option value="">Select Subject</option>
                        {
                            subjects
                                .sort()
                                .map(subject => <option key={subject}>{subject}</option>)
                        }
                    </select>
                </div>
                <div className="container">
                    {
                        sorted_entries
                            .map(([lesson_id, lesson_meta]) => (
                                console.log('dekho', lesson_id, lesson_meta.chapter_name),
                                <div className="card" key={lesson_id}>
                                    <div className="card-row">
                                        <div className="card-row inner">
                                            <img src={PlayIcon} alt="play-icon" height="24" width="24" />
                                            <p className="card-title">{lesson_meta.name}</p>
                                        </div>
                                        <div style={{ marginLeft: "auto" }}>
                                            <img src={ContentCopyIcon} alt="copy-icon" className="copyIcon" onClick={() => copyLink(`https://ilmexchange.com/library/${lesson_id.replace(/-/g, '/').slice(0, -2)}/${lesson_meta.chapter_name}`)} />
                                        </div>
                                    </div>
                                    <div className="card-row">
                                        <p className="student-class-title">Class: {getClassTitleFromLessonId(lesson_id)}-{getSubjectTitleFromLessonId(lesson_id)}</p>
                                    </div>
                                    <div className="card-row">
                                        <div className="more-detail">
                                            <p className="hidden-views viewer"
                                                style={{ marginLeft: "auto" }}
                                                onClick={() => handleClickShowViewers(lesson_id)}>{lesson_meta.watchCount} views</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
        </div>
    )

}

export default connect((state: RootReducerState) => ({
    students: state.db.students,
    classes: state.db.classes,
    events: state.db.ilmx.events,
    lessons: state.db.ilmx.lessons,
    isLoading: state.ilmxLessons.isLoading,
    hasError: state.ilmxLessons.hasError
}), (dispatch: Function) => ({
    fetchLessons: () => dispatch(fetchLessons())
}))(SubjectTable)

type AugmentedIlmxLessons = {
    [id: string]: AugmentedIlmxLesson
}

type ComputeLessonsData = {
    (events: PropsType["events"], lessons: PropsType["lessons"], date: number, class_title: string, subject: string): AugmentedIlmxLessons
}

const computeLessonsData: ComputeLessonsData = (events, lessons, date, class_title, subject) => {

    let agg: AugmentedIlmxLessons = {}

    const lessons_meta = lessons || {}

    if (!lessons_meta) {
        return agg
    }

    Object.entries(events || {})
        .forEach(([, lessons_history]) => {

            for (const [timestamp, item] of Object.entries(lessons_history)) {

                const is_same_date = date ? moment(parseInt(timestamp)).isSame(moment(date), "day") : true

                if (item.type === "VIDEO" && is_same_date) {

                    const { lesson_id, duration, student_id } = item

                    const s_title = getSubjectTitleFromLessonId(lesson_id)
                    const c_title = getClassTitleFromLessonId(lesson_id)

                    if ((subject ? s_title === subject : true) && (class_title ? c_title === class_title : true)) {

                        if (agg[lesson_id]) {

                            agg[lesson_id] = {
                                ...agg[lesson_id],
                                watchCount: agg[lesson_id].watchCount + 1,
                                watchTime: agg[lesson_id].watchTime + duration,
                                viewers: {
                                    ...agg[lesson_id].viewers,
                                    [student_id]: {
                                        watchCount: agg[lesson_id].viewers[student_id] ? agg[lesson_id].viewers[student_id].watchCount + 1 : 1,
                                        watchTime: agg[lesson_id].viewers[student_id] ? agg[lesson_id].viewers[student_id].watchTime + duration : duration
                                    }
                                }
                            }
                        } else {
                            agg[lesson_id] = {
                                watchCount: 1,
                                watchTime: duration,
                                // @ts-ignore
                                ...lessons_meta[lesson_id],
                                viewers: {
                                    [student_id]: {
                                        watchCount: 1,
                                        watchTime: duration
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

    return agg
}

const getClassSubjectsInfo = (events: PropsType["events"]) => {

    let class_titles = new Set<string>()
    let subjects = new Set<string>()
    Object.entries(events || {})
        .forEach(([, lessons_history]) => {
            for (const [, item] of Object.entries(lessons_history)) {
                if (item.type === "VIDEO") {
                    const { lesson_id } = item
                    const class_title = getClassTitleFromLessonId(lesson_id)
                    const subject = getSubjectTitleFromLessonId(lesson_id)
                    class_titles.add(class_title)
                    subjects.add(subject)
                }
            }
        })

    return { classTitles: [...class_titles], subjects: [...subjects] }
}

const getSortedEntries = (lessons_data: AugmentedIlmxLessons, sortOrder: boolean) => {

    if (sortOrder) {
        return Object.entries(lessons_data)
            .sort(([, a], [_, b]) => a.watchCount - b.watchCount)
    }

    return Object.entries(lessons_data)
        .sort(([, a], [_, b]) => b.watchCount - a.watchCount)
}

const getClassTitleFromLessonId = (lessonId: string): string => {
    return lessonId.split("-")[1] || "nil"
}

const getSubjectTitleFromLessonId = (lessonId: string): string => {
    return lessonId.split("-")[2] || "nil"
}