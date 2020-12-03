import React from 'react'

import { AppLayout } from 'components/layout'
import { PageHeading } from 'components/app/pageHeading'

export const StudentExam = () => {
    return (
        <AppLayout title="Student Exams">
            <div className="container mx-auto md:ml-64 px-4 sm:px-8">
                <div className="py-8">
                    <PageHeading title={"Student Exams"} />
                </div>
            </div>
        </AppLayout>
    )
}