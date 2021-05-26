import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { getNumberArrayFromRange } from 'utils/helpers'

interface PaginationProps {
	items: Array<any>
	itemsPerPage: number
	numberOfBottomPages: number
	renderComponent: (item: any) => JSX.Element
}

const Paginate = ({
	items,
	itemsPerPage,
	numberOfBottomPages,
	renderComponent
}: PaginationProps) => {
	const [pageIndex, setPageIndex] = useState(0)
	const sliceStart = pageIndex * itemsPerPage
	const sliceEnd = sliceStart + itemsPerPage

	const [currItems, setCurrItems] = useState(items.slice(sliceStart, sliceEnd))

	useEffect(() => {
		// Length changes if a filter is applied,
		// So we have to paginate the results again
		setCurrItems(items.slice(sliceStart, sliceEnd))
		setPageIndex(0)
	}, [items.length])

	useEffect(() => {
		setCurrItems(items.slice(sliceStart, sliceEnd))

		// if page index is 0 then reset the page array
		if (pageIndex === 0) {
			setPageArray(getNumberArrayFromRange(numberOfBottomPages, pageIndex))
		}

		// For Next
		if (
			currItems.length >= itemsPerPage &&
			pageIndex !== totalPages - 1 &&
			pageIndex === pageArray[numberOfBottomPages - 1]
		) {
			setPageArray(getNumberArrayFromRange(getPageArrayLength(), pageIndex))
		}

		// For Previous
		if (pageIndex - (numberOfBottomPages - 1) >= 0 && pageIndex === pageArray[0]) {
			setPageArray(
				getNumberArrayFromRange(numberOfBottomPages, pageIndex - (numberOfBottomPages - 1))
			)
		}
	}, [pageIndex])

	const getPageArrayLength = () => {
		return totalPages - pageIndex >= 3 ? 3 : totalPages - pageIndex
	}

	const totalPages = Math.ceil(items.length / itemsPerPage)
	const [pageArray, setPageArray] = useState(
		getNumberArrayFromRange(getPageArrayLength(), pageIndex)
	)

	const goToPage = (index: number) => {
		if (index >= 0 && index <= totalPages - 1) {
			setPageIndex(index)
		}
	}

	const onNext = () => {
		// handle case: when the user navigates to the last index by repeatedly pressing prev and then wants to navigate next
		// Why: Because the last element of page array is the first elem for the next iteration & vice versa
		// So we need to recreate the Array
		if (pageIndex === pageArray[numberOfBottomPages - 1]) {
			setPageArray(getNumberArrayFromRange(getPageArrayLength(), pageIndex))
		}

		// subtracting one because our page index starts from 0
		if (pageIndex < totalPages - 1) {
			setPageIndex(index => index + 1)
		}
	}

	const onPrevious = () => {
		// handle case: when the user navigates to the first index by repeatedly pressing next and then wants to navigate back
		// Why: Because the last element of page array is the first elem for the next iteration & vice versa
		// So we need to recreate the Array
		if (pageIndex > 0 && pageIndex === pageArray[0]) {
			setPageArray(
				getNumberArrayFromRange(numberOfBottomPages, pageIndex - (numberOfBottomPages - 1))
			)
		}

		if (pageIndex - 1 >= 0) {
			setPageIndex(index => index - 1)
		}
	}

	const onReset = () => {
		setPageIndex(0)
	}
	return (
		<>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-12 gap-y-12 md:gap-y-20">
				{currItems.map(item => renderComponent(item))}
			</div>
			{items.length >= itemsPerPage && (
				<div className="flex flex-row my-4 flex-wrap">
					<button
						className="border p-2 bg-white shadow-md mr-2 mb-1 rounded-md"
						onClick={onPrevious}>
						Prev
					</button>
					{pageArray.map(page => (
						<button
							key={page}
							className={clsx(
								'border px-4 py-2 bg-white shadow-md mr-2 mb-1 rounded-md font-bold lg:text-xl',
								page === pageIndex ? 'bg-teal-brand text-white' : ''
							)}
							onClick={() => goToPage(page)}>
							{page}
						</button>
					))}
					<button
						className="border p-2 bg-white shadow-md mr-2 mb-1 rounded-md"
						onClick={onNext}>
						Next
					</button>
					<button
						className="border p-2 bg-white shadow-md mr-2 mb-1 rounded-md"
						onClick={onReset}>
						Reset
					</button>
				</div>
			)}
		</>
	)
}

export default Paginate
