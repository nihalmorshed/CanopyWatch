import { useState, useRef, useCallback } from 'react'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  onPreviewCreated?: (previewUrl: string) => void
  disabled?: boolean
  remainingQuota?: number
}

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ImageUploader({ onImageSelect, onPreviewCreated, disabled, remainingQuota }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please use JPEG, PNG, or WebP.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum size is 20MB.'
    }
    return null
  }, [])

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onImageSelect(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      const previewUrl = reader.result as string
      setPreview(previewUrl)
      onPreviewCreated?.(previewUrl)
    }
    reader.readAsDataURL(file)
  }, [validateFile, onImageSelect, onPreviewCreated])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [disabled, handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const isQuotaDepleted = remainingQuota !== undefined && remainingQuota <= 0

  if (isQuotaDepleted) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <span className="text-4xl block mb-3">🚫</span>
        <p className="text-red-700 dark:text-red-300 font-medium">
          Tree analysis quota exhausted
        </p>
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          Your free plan includes 5 analyses per month. Please upgrade or wait until next month.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Selected canopy"
            className="w-full rounded-xl object-cover max-h-96"
          />
          <button
            onClick={() => {
              setPreview(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          <span className="text-4xl block mb-3">📷</span>
          <p className="text-slate-600 dark:text-slate-400 mb-1">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-sm text-slate-500">
            Supports JPEG, PNG, WebP (max 20MB)
          </p>
        </div>
      )}

      {remainingQuota !== undefined && remainingQuota > 0 && (
        <p className="text-xs text-slate-500 text-center">
          {remainingQuota} analysis{remainingQuota !== 1 ? 'ies' : ''} remaining this month
        </p>
      )}
    </div>
  )
}