import React from 'react'

import UserIconSvg from 'assets/svgs/user.svg'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'
import Camera from 'components/Camera'

interface UploadImageProps {
	src: string
	handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	handleCameraImageTaken?: (imgString: string) => void
}

export const UploadImage = ({
	src,
	handleImageChange,
	handleCameraImageTaken
}: UploadImageProps) => {
	const {
		ref: cameraModalRef,
		isComponentVisible: showCamera,
		setIsComponentVisible: setShowCamera
	} = useComponentVisible(false)

	const onCameraImageTaken = (imgString: string) => {
		handleCameraImageTaken(imgString)
		setShowCamera(!showCamera)
	}

	return (
		<>
			<div
				onClick={() => setShowCamera(!showCamera)}
				className="bg-white p-1 rounded-full text-teal-brand cursor-pointer">
				<svg
					className="w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</div>
			{showCamera && (
				<TModal>
					<div ref={cameraModalRef}>
						<Camera
							onImageAccepted={onCameraImageTaken}
							height={100}
							width={100}
							format="jpeg"
							onClose={() => setShowCamera(!showCamera)}
						/>
					</div>
				</TModal>
			)}
			<div className="w-24 h-24">
				<img className="rounded-full" src={src || UserIconSvg} alt="image" />
			</div>
			<label
				className="bg-white p-1 rounded-full text-teal-brand cursor-pointer"
				title="Upload Image">
				<input
					type="file"
					className="hidden"
					accept="image/*"
					onChange={handleImageChange}
				/>
				<svg
					className="w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
					/>
				</svg>
			</label>
		</>
	)
}
