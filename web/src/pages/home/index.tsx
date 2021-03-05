import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import cond from 'cond-construct'
import clsx from 'clsx'

import { SettingsTab } from './settings'
import { ActionTab } from './actions'
import { StatsTab } from './statistics'

import { AppLayout } from 'components/Layout/appLayout'

enum Tabs {
	SETTINGS,
	ACTIONS,
	STATS
}

const tabTitles = ["Settings", "Actions", "Statistics"]

export const Home = () => {

	const { auth } = useSelector((state: RootReducerState) => state)

	const [activeTab, setActiveTab] = useState(Tabs.ACTIONS)

	const renderComponent = () => (
		cond([
			[activeTab === Tabs.SETTINGS, () => <SettingsTab />],
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
		<AppLayout title={"Home" + " - " + tabTitles[activeTab]}>
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
			<div className="bg-green-brand gap-x-4 grid-cols-3 inline-grid pb-0 pt-2 shadow-md text-center text-lg text-teal-200 w-full">
				<div
					onClick={() => setTab(Tabs.SETTINGS)}
					className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.SETTINGS })}>
					<span>{tabTitles[Tabs.SETTINGS]}</span>
				</div>
				<div
					onClick={() => setTab(Tabs.ACTIONS)}
					className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.ACTIONS })}>
					<span>{tabTitles[Tabs.ACTIONS]}</span>
				</div>
				<div
					onClick={() => setTab(Tabs.STATS)}
					className={clsx("pb-2 cursor-pointer", { "border-b-4 border-white text-white": tab === Tabs.STATS })}>
					<span>{tabTitles[Tabs.STATS]}</span>
				</div>
			</div>
		</div>
	)
}