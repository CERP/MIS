import { useEffect, useRef } from 'react'

export function usePrevious<T>(value: T) {
	/**
	 * Usefull if we want to compare previous state with
	 * the one in our latest render, in functional components.
	 */

	const ref = useRef(null)
	useEffect(() => {
		ref.current = value
	})
	return ref.current
}
