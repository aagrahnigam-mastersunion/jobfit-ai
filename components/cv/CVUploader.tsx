'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface CVStatus {
  hasVector: boolean
  vectorId?: string
  filename?: string
  uploadedAt?: string
  summary?: string
}

interface Props {
  status: CVStatus
  onUploadComplete: (vectorId: string, summary: string) => void
  onDelete: () => void
}

export function CVUploader({ status, onUploadComplete, onDelete }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum 10MB.')
      return
    }
    if (!file.name.match(/\.(pdf|docx)$/i)) {
      toast.error('Please upload a PDF or DOCX file.')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/cv/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Upload failed')
      }

      toast.success('CV parsed and stored successfully!')
      onUploadComplete(data.vectorId, data.summary)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch('/api/cv/vector', { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('CV data deleted.')
      onDelete()
    } catch {
      toast.error('Failed to delete CV data.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (status.hasVector) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border-2 border-green-200 bg-green-50 dark:bg-green-950/20 p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm text-green-700">CV Stored</p>
              {status.filename && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <FileText className="h-3 w-3" />
                  {status.filename}
                </p>
              )}
              {status.summary && (
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{status.summary}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Replace'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </motion.div>
    )
  }

  return (
    <div
      className={`
        relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm font-medium">Parsing your CV with AI...</p>
            <p className="text-xs text-muted-foreground mt-1">This takes a few seconds</p>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">Drop your CV here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PDF or DOCX · Max 10MB</p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Raw files are never stored — only extracted skills
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
