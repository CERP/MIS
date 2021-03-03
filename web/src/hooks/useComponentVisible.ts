import { useState, useEffect, useRef } from 'react'

export const useComponentVisible = (isVisible: boolean) => {
	const [isComponentVisible, setIsComponentVisible] = useState(isVisible)
	const ref = useRef(null)

	const handleClickOutside = (event: any) => {
		if (ref.current && !ref.current.contains(event.target) && isComponentVisible) {
			setIsComponentVisible(false)
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	})

	return { ref, isComponentVisible, setIsComponentVisible }
}