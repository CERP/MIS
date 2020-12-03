import React from 'react'

import { AppLayout } from 'components/layout'

export const StudentExam = () => {
    return (
        <AppLayout title="Student Exams">
            <div className="container mx-auto md:ml-64 px-4 sm:px-8">
                <div className="py-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-semibold leading-tight">Student Exams</h2>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}