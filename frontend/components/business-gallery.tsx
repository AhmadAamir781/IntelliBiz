"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface BusinessGalleryProps {
  images: string[]
  businessName: string
}

export function BusinessGallery({ images, businessName }: BusinessGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const imagesPerPage = 8
  const totalPages = Math.ceil(images.length / imagesPerPage)

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const currentImages = images.slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage)

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
        {currentImages.map((image, index) => (
          <Dialog key={index + currentPage * imagesPerPage}>
            <DialogTrigger asChild>
              <Card className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${businessName} image ${index + 1 + currentPage * imagesPerPage}`}
                      className="object-cover w-full h-full"
                      onClick={() => setSelectedImage(index + currentPage * imagesPerPage)}
                    />
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-4xl p-0 bg-transparent border-none">
              <div className="relative">
                <img
                  src={images[selectedImage !== null ? selectedImage : index + currentPage * imagesPerPage]}
                  alt={`${businessName} image ${selectedImage !== null ? selectedImage + 1 : index + 1 + (currentPage * imagesPerPage)}`}
                  className="w-full h-auto max-h-[80vh] object-contain bg-black"
                />
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-5 w-5" />
                </button>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {(selectedImage !== null ? selectedImage : index + currentPage * imagesPerPage) + 1} / {images.length}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="p-2 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

