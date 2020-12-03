import React from 'react'

import { AppLayout } from 'components/layout'
import { PageHeading } from 'components/app/pageHeading'

export const StudentFee = () => {
    return (
        <AppLayout title="Student Fees">
            <div className="container mx-auto md:ml-64 px-4 sm:px-8">
                <div className="py-8">
                    <PageHeading title={"Student Fees"} />
                </div>
            </div>
        </AppLayout>
    )
}