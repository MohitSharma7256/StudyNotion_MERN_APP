import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(editData || "")

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setValue(name, file) // FORM MEIN FILE SET
      previewFile(file)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop,
    multiple: false,
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  useEffect(() => {
    register(name, { required: !editData })
  }, [register, name, editData])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5">
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div
        {...getRootProps()}
        className="flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500 bg-richblack-700 p-6"
      >
        <input
          {...getInputProps()}
          type="file"
          accept=".jpeg,.jpg,.png"
          style={{ display: "none" }}
        />

        {previewSource ? (
          <div className="flex w-full flex-col items-center">
            <img
              src={previewSource}
              alt="Thumbnail"
              className="max-h-[200px] rounded-md object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setPreviewSource("")
                setSelectedFile(null)
                setValue(name, null)
              }}
              className="mt-2 text-sm text-richblack-400 underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <FiUploadCloud className="mx-auto text-3xl text-yellow-50" />
            <p className="mt-2 text-sm text-richblack-200">
              Drag & drop or <span className="font-bold text-yellow-50">Browse</span>
            </p>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-200">Thumbnail is required</span>
      )}
    </div>
  )
}