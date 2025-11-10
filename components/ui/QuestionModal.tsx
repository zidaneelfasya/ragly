"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface QuestionModalProps {
  open: boolean
  onClose: () => void
}

export function QuestionModal({ open, onClose }: QuestionModalProps) {
  const [question, setQuestion] = useState("")

  const handleSubmit = () => {
    console.log("Pertanyaan:", question)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Form Pertanyaan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="question">Pertanyaan</Label>
          <Input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tuliskan pertanyaan kamu..."
          />
          <Button onClick={handleSubmit} className="w-full">
            Kirim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
