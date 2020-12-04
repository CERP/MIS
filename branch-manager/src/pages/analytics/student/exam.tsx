import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { AppLayout } from 'components/layout'
import { PageHeading } from 'components/app/pageHeading'
import { AppState } from 'reducers'

export const StudentExam = () => {

    const schools = useSelector((state: AppState) => state.user.schools)

    const [schoolId, setSchoolId] = useState(Object.keys(schools)[0])
    const [loading, setLoading] = useState(false)

    return (
        <AppLayout title="Student Exams">
            <div className="container mx-auto md:ml-64 px-4 sm:px-8">
                <div className="py-8">
                    <PageHeading title={"Student Exams"} />

                    <div className="my-2 flex flex-row justify-end">
                        <div className="flex flex-row mb-1 sm:mb-0">
                            <div className="relative">
                                <select className="h-full rounded border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    onChange={(e) => setSchoolId(e.target.value)}
                                    defaultValue={schoolId}
                                >
                                    <option>Select School</option>
                                    {
                                        Object.keys(schools || {}).sort().map(id => <option key={id} value={id} >{id}</option>)
                                    }
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-red-500 mb-2 h-2">{loading ? 'Loading...' : ''}</div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="w-full table-auto leading-normal">
                                <thead className="bg-gray-200 border-b-2 border-gray-200 uppercase text-xs text-center font-semibold tracking-wider spac">
                                    <tr>
                                        <th className="px-5 py-3"> Name </th>
                                        <th className="px-5 py-3"> Marks </th>
                                        <th className="px-5 py-3"> Percentage </th>
                                        <th className="px-5 py-3"> Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}