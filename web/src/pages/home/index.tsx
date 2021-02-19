import React, { useState } from 'react'
import cond from 'cond-construct'
import clsx from 'clsx'

import { AppLayout } from 'components/Layout/appLayout'
import { SettingTab } from './settings'
import { ActionTab } from './actions'
import { StatsTab } from './statistics'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

enum Tabs {
	SETTINGS,
	ACTIONS,
	STATS
}

export const Home = () => {

	const { auth } = useSelector((state: RootReducerState) => state)

	const [activeTab, setActiveTab] = useState(Tabs.ACTIONS)

	const renderComponent = () => (
		cond([
			[activeTab === Tabs.SETTINGS, () => <SettingTab />],
			[activeTab === Tabs.ACTIONS, () => <ActionTab />],
			[activeTab === Tabs.STATS, () => <StatsTab />],
		])
	)

	// TODO: remove this logic
	// add more robust way of redirection

	if (auth?.token && !auth?.faculty_id) {
		return <Redirect to="/staff-login" />
	}

	return (
		<AppLayout title="Home">
			<Tabbar tab={activeTab} setTab={setActiveTab} />
			{renderComponent()}
		</AppLayout>
	)
}

type TabbarProps = {
	tab: Tabs
	setTab: (tab: Tabs) => void
}

const Tabbar = ({ tab, setTab }: TabbarProps) => {
	return (
		<div className="sticky inset-0 top-16 z-30">

			<div className="text-center w-full inline-grid grid-cols-3 ga-x-4 bg-teal-500 px-4 pt-6 pb-0 shadow-xl text-teal-200 text-lg">
				<div
					onClick={() => setTab(Tabs.SETTINGS)}
					className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.SETTINGS })}>
					Settings
			</div>
				<div
					onClick={() => setTab(Tabs.ACTIONS)}
					className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.ACTIONS })}>
					Actions
			</div>
				<div
					onClick={() => setTab(Tabs.STATS)}
					className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.STATS })}>
					Statistics
			</div>
			</div>
		</div>
	)
}