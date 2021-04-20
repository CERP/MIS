import React from 'react'
import { CameraIcon, UploadIcon } from '@heroicons/react/outline'
import { XCircleIcon } from '@heroicons/react/solid'

import UserIconSvg from 'assets/svgs/user.svg'
import { useComponentVisible } from 'hooks/useComponentVisible'
import { TModal } from 'components/Modal'
import Camera from 'components/Camera'

interface UploadImageProps {
	src: string
	handleImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	handleCameraImageTaken?: (imgString: string) => void
	removeImage?: () => void
}

export const UploadImage = ({
	src,
	handleImageChange,
	handleCameraImageTaken,
	removeImage
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
			{removeImage ? (
				<XCircleIcon
					onClick={removeImage}
					className="w-8 bg-white p-1 rounded-full text-red-brand cursor-pointer"
				/>
			) : (
				<CameraIcon
					onClick={() => setShowCamera(!showCamera)}
					className="w-8 bg-white p-1 rounded-full text-teal-brand cursor-pointer"
				/>
			)}
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
			<img
				className="w-24 h-24 rounded-full object-contain ring-1 ring-white"
				src={src || UserIconSvg}
				alt="image"
			/>
			<label
				className="bg-white p-1 rounded-full text-teal-brand cursor-pointer"
				title="Upload Image">
				<input
					type="file"
					className="hidden"
					accept="image/*"
					onChange={handleImageChange}
				/>
				<UploadIcon className="w-6" />
			</label>
		</>
	)
}
