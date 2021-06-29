import React, { useEffect, useState } from 'react'
import cond from 'cond-construct'
import { useMediaPredicate } from 'react-media-hook'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { SettingsTab } from './settings'
import { ActionTab } from './actions'
import { StatsTab } from './statistics'
import { AppLayout } from 'components/Layout/appLayout'
import { Tabbar } from 'components/tabs'
import { fetchTargetedInstruction } from 'actions'

enum Tabs {
	SETTINGS,
	ACTIONS,
	STATS
}

const TabbarContent = [
	{
		tab: Tabs.SETTINGS,
		title: 'Settings'
	},
	{
		tab: Tabs.ACTIONS,
		title: 'Actions'
	},
	{
		tab: Tabs.STATS,
		title: 'Statistics'
	}
]

export const Home = () => {
	const urlParams = new URLSearchParams(location.search)
	const history = useHistory()
	const faculty = useSelector((state: RootReducerState) => state.db.faculty)
	const faculty_id = useSelector((state: RootReducerState) => state.auth.faculty_id)
	const tip_access = useSelector(
		(state: RootReducerState) => state.db.targeted_instruction_access
	)
	const dispatch = useDispatch()

	const [activeTab, setActiveTab] = useState<number>(
		parseInt(urlParams.get('active-tab') ?? '1') ?? Tabs.ACTIONS
	)
	const biggerThan880 = useMediaPredicate('(min-width: 880px)')

	const { permissions = {} as MISTeacher['permissions'], Admin, SubAdmin } = faculty[faculty_id]

	useEffect(() => {
		if (tip_access) {
			dispatch(fetchTargetedInstruction())
		}
	}, [])

	const renderComponent = () =>
		cond([
			[
				activeTab === Tabs.SETTINGS,
				() => <SettingsTab permissions={permissions} admin={Admin} subAdmin={SubAdmin} />
			],
			[
				activeTab === Tabs.ACTIONS,
				() => <ActionTab permissions={permissions} admin={Admin} subAdmin={SubAdmin} />
			],
			[
				activeTab === Tabs.STATS,
				() => <StatsTab permissions={permissions} admin={Admin} subAdmin={SubAdmin} />
			]
		])

	if (!biggerThan880) {
		return (
			<AppLayout title={'Home' + ' - ' + TabbarContent[activeTab].title}>
				<Tabbar
					setTabParams={tab =>
						history.push({
							pathname: location.pathname,
							search: '?active-tab=' + tab
						})
					}
					tab={activeTab}
					setTab={setActiveTab}
					content={TabbarContent}
				/>
				{renderComponent()}
			</AppLayout>
		)
	}

	return (
		<AppLayout>
			<div className="grid grid-cols-3 relative">
				<div className="fixed w-4/12">
					<div className="flex flex-col items-center bg-white shadow-md rounded-2xl m-5 border-gray-100 border">
						<h1 className="text-xl font-semibold mt-4">Settings</h1>
						<SettingsTab permissions={permissions} admin={Admin} subAdmin={SubAdmin} />
					</div>
				</div>
				<div className="col-start-2 col-end-3">
					<div className="flex flex-col items-center rounded-2xl m-5">
						<h1 className="text-xl font-semibold">Actions</h1>
						<ActionTab permissions={permissions} admin={Admin} subAdmin={SubAdmin} />
					</div>
				</div>
				<div className="fixed right-0 w-4/12">
					<StatsTab permissions={permissions} admin={Admin} subAdmin={SubAdmin} />
				</div>
			</div>
		</AppLayout>
	)
}
