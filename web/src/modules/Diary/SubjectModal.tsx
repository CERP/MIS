import React, { useState, useMemo } from "react"
import { PlayIcon } from 'assets/icons'
import { ContentCopyIcon } from 'assets/icons'
import './style.css'

interface PropsType {
    lessons: IlmxLessonVideos
    isLoading: boolean
    onClose: () => void
}

interface S {
    lessonId: string
}

const SubjectModal: React.FC<PropsType> = ({ lessons, onClose }) => {

    const [classFilter, setClassFilter] = useState('1')
    const [subjectFilter, setSubjectFilter] = useState('')

    const { classTitles, subjects } = useMemo(() => getClassSubjectsInfo(lessons), [lessons])

    const lessons_data = useMemo(
        () => getFilteredData(lessons, classFilter, subjectFilter),
        [lessons, classFilter, subjectFilter]
    )

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
                        Object.entries(lessons_data || {} as IlmxLessonVideos)
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

export default SubjectModal

const getFilteredData = (lessons: IlmxLessonVideos, class_title: string, subject: string) => {

    let lessonVideos

    for (let [id, lessonObj] of Object.entries(lessons || {})) {

        const s_title = getSubjectTitleFromLessonId(id)
        const c_title = getClassTitleFromLessonId(id)

        if ((subject ? s_title === subject : true) && (class_title ? c_title === class_title : true)) {
            lessonVideos = {
                ...lessonVideos as IlmxLesson,
                [id]: lessonObj
            }
        }
    }
    return lessonVideos
}

const getClassSubjectsInfo = (lessons: IlmxLessonVideos) => {
    let class_titles = new Set<string>()
    let subjects: string[] = []
    for (let [id, lessonObj] of Object.entries(lessons || {})) {
        if (lessonObj.type === "Video") {
            const class_title = getClassTitleFromLessonId(id)
            const subject = getSubjectTitleFromLessonId(id)
            class_titles.add(class_title)
            if (!subjects.includes(subject.trim())) {
                subjects.push(subject)
            }
        }
    }
    return { classTitles: [...class_titles], subjects: [...subjects] }
}

const getClassTitleFromLessonId = (lessonId: string): string => {
    return lessonId.split("-")[1] || "nil"
}

const getSubjectTitleFromLessonId = (lessonId: string): string => {
    return lessonId.split("-")[2] || "nil"
}