import React, { useState } from 'react';
import { Heart, Maximize2, Trash2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ImageShowcaseCard = ({ 
  imageUrl = "/api/placeholder/800/600", 
  title = "",
  date = "April 4, 2025",
  maxWidth = "180px", 
  onDelete = () => console.log("Delete image"),
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <div style={{ maxWidth }} className="w-full mx-auto p-2">
      <Card className="overflow-hidden bg-white shadow-md rounded-lg py-0">
        {/* Image Container */}
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-60 object-cover"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Image Actions */}
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <button 
              onClick={() => setShowDeleteDialog(true)} 
              className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          </div>
          
          {/* Bottom Actions */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            {/* <button 
              onClick={toggleLike} 
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isLiked 
                  ? 'bg-red-500/90 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart size={16} fill={isLiked ? "white" : "none"} />
            </button> */}
            
            <button 
              onClick={() => setShowFullscreen(true)}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            >
              <Maximize2 size={16} className="text-white" />
            </button>
          </div>
          
          {/* Title overlay */}
          <div className="absolute bottom-2 left-2">
            <h3 className="text-sm font-medium text-white">{title}</h3>
            <p className="text-xs text-white/80">{date}</p>
          </div>
        </div>
      </Card>
      
      {/* Fullscreen View */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <X size={20} className="text-white" />
          </button>
          <img 
            src={imageUrl} 
            alt={title}
            className="max-h-screen max-w-full object-contain"
          />
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-xs mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageShowcaseCard;