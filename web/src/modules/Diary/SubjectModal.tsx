import React, { useState, useEffect, useMemo } from "react"
import { connect } from 'react-redux'
import { fetchLessons } from 'actions/core'
import { PlayIcon } from 'assets/icons'
import { ContentCopyIcon } from 'assets/icons'
import './style.css'

interface PropsType {
    events: RootDBState["ilmx"]["events"]
    lessons: RootDBState["ilmx"]["lessons"]
    isLoading: boolean
    fetchLessons: () => void
    onClose: () => void
}

interface S {
    showViewerModal: boolean
    lessonId: string
    scrollY: number
}

const SubjectModal: React.FC<PropsType> = ({ events, lessons, fetchLessons, onClose }) => {

    const [classFilter, setClassFilter] = useState('')
    const [subjectFilter, setSubjectFilter] = useState('')

    useEffect(() => {
        fetchLessons()
    }, [fetchLessons])

    const { classTitles, subjects } = useMemo(() => getClassSubjectsInfo(events), [events])
    const lessons_data = useMemo(
        () => computeLessonsData(events, lessons, classFilter, subjectFilter),
        [events, lessons, classFilter, subjectFilter]
    )

    const sorted_entries = getSortedEntries(lessons_data)

    const copyLink = (link: string) => {
        navigator.clipboard.writeText(link)
    }

    const getLink = (link: string) => {
        const manipulatedLink = link.replace(/-/g, '/')
        const finalLink = encodeURI(manipulatedLink.slice(0, -2))
        return finalLink
    }

    return (

        <div className="subject-modal modal-container inner">
            <div className="close button red" onClick={onClose}>✕</div>
            <div className="title">Video Lectures</div>
            <div className="form scrollbar">
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
                                <div className="card" key={lesson_id}>
                                    <div className="card-row">
                                        <div className="card-row inner lesson-div">
                                            <div className="chapter-name-div"> 
                                                <img src={PlayIcon} alt="play-icon" height="24" width="24" />
                                                <p className="card-title">{lesson_meta.name}</p>
                                            </div>
                                            <div className="card-row">
                                        <p className="student-class-title">Class: {getClassTitleFromLessonId(lesson_id)}-{getSubjectTitleFromLessonId(lesson_id)}</p>
                                    </div>
                                        </div>
                                        <div style={{ marginLeft: "auto" }}>
                                            <div className="copy-icon-div">
                                                <img src={ContentCopyIcon} alt="copy-icon" className="copyIcon" onClick={() => copyLink(`https://ilmexchange.com/library/${getLink(lesson_id)}/${lesson_meta.chapter_name && encodeURI(lesson_meta.chapter_name)}`)} />
                                            </div>
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
    events: state.db.ilmx.events,
    lessons: state.db.ilmx.lessons,
    isLoading: state.ilmxLessons.isLoading,
}), (dispatch: Function) => ({
    fetchLessons: () => dispatch(fetchLessons())
}))(SubjectModal)

type AugmentedIlmxLessons = {
    [id: string]: AugmentedIlmxLesson
}

type ComputeLessonsData = {
    (events: PropsType["events"], lessons: PropsType["lessons"], class_title: string, subject: string): AugmentedIlmxLessons
}

const computeLessonsData: ComputeLessonsData = (events, lessons, class_title, subject) => {

    let agg: AugmentedIlmxLessons = {}

    const lessons_meta = lessons || {}

    if (!lessons_meta) {
        return agg
    }

    Object.entries(events || {})
        .forEach(([, lessons_history]) => {

            for (const [, item] of Object.entries(lessons_history)) {

                if (item.type === "VIDEO" && true) {

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

const getSortedEntries = (lessons_data: AugmentedIlmxLessons) => {
    return Object.entries(lessons_data)
        .sort(([, a], [_, b]) => b.watchCount - a.watchCount)
}

const getClassTitleFromLessonId = (lessonId: string): string => {
    return lessonId.split("-")[1] || "nil"
}

const getSubjectTitleFromLessonId = (lessonId: string): string => {
    return lessonId.split("-")[2] || "nil"
}