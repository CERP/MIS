import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

import { AppLayout } from 'components/Layout/appLayout'
import { createMerges } from 'actions/core'
import { toTitleCase } from 'utils/toTitleCase'
import { TEMPLATE_OPTIONS } from 'constants/index'

type State = {
	templates: {
		[id: string]: {
			edited: boolean
			value: string
		}
	}
}

export const SMSTemplates = () => {
	const dispatch = useDispatch()
	const smsTemplates = useSelector((state: RootReducerState) => state.db.sms_templates)

	// TODO: handle props on update from other device

	// as we're adding new staff attendance template, to generate card, we have to
	// do this way so that for old schools it should work fine
	const mergedTemplates = {
		attendance_staff: '',
		...smsTemplates
	}

	// added a edited boolean to enable or disable save button
	const mutated = Object.entries(mergedTemplates ?? {}).reduce<State['templates']>(
		(agg, [k, v]) => ({
			...agg,
			[k]: {
				edited: false,
				value: v
			}
		}),
		{}
	)

	const [state, setState] = useState<State>({
		templates: mutated
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = event.target

		setState({ ...state, templates: { ...state.templates, [name]: { value, edited: true } } })
	}

	const saveTemplate = (type: string) => {
		const template = state.templates[type]

		if (template.edited) {
			dispatch(createMerges([{ path: ['db', 'sms_templates', type], value: template.value }]))

			toast.success('SMS Template has been saved', {
				duration: 2000
			})

			setState({
				...state,
				templates: { ...state.templates, [type]: { value: template.value, edited: false } }
			})
		}
	}

	return (
		<AppLayout title="SMS Templates" showHeaderTitle>
			<div className="p-5 lg:p-10 lg:pt-5 relative print:hidden">
				<div className="space-y-4">
					{Object.entries(state.templates)
						.sort(([a], [b]) => a.localeCompare(b))
						.map(([type, template]) => (
							<TemplateCard
								key={type}
								title={type}
								options={TEMPLATE_OPTIONS[type]}
								onChangeInput={handleInputChange}
								templateString={template.value}
								onSave={saveTemplate}
								edited={template.edited}
							/>
						))}
				</div>
			</div>
		</AppLayout>
	)
}

type TemplateCardProps = {
	title: string
	options: string[]
	onChangeInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	templateString: string
	edited: boolean
	onSave: (type: string) => void
}

const TemplateCard = ({
	title,
	options,
	templateString,
	onChangeInput,
	onSave,
	edited
}: TemplateCardProps) => {
	return (
		<fieldset className="border border-solid border-gray-300 py-5 px-8 lg:px-10">
			<legend className="px-2">{toTitleCase(title, '_')}</legend>
			<div className="flex flex-col lg:flex-row justify-between">
				<ul className="list-disc text-sm">
					{(options ?? []).map((opt, index) => (
						<li key={index + opt.length}>{opt}</li>
					))}
				</ul>
				<textarea
					name={title}
					onChange={onChangeInput}
					placeholder="Start creating template here..."
					className="tw-input w-full lg:w-1/2 ring-1 ring-blue-brand"
					rows={3}
					value={templateString}
					cols={3}
				/>
			</div>
			<div className="flex justify-end mt-2">
				<button
					onClick={() => onSave(title)}
					disabled={!(edited && templateString)}
					className={clsx(
						'w-full lg:w-28',
						edited && templateString ? 'tw-btn-blue' : 'tw-btn bg-gray-brand'
					)}>
					Save
				</button>
			</div>
		</fieldset>
	)
}
