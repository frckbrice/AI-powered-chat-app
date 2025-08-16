import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../../../ui/dialog";
import Image from "next/image";

interface ImageDialogProps {
  src: string;
  open: boolean;
  onClose: () => void;
}

export const ImageDialog = ({ src, open, onClose }: ImageDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      {/* change the color of close button */}
      <DialogContent className="max-w-[90vw] max-h-[70vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <DialogDescription className="relative flex justify-center items-center">
          <Image
            src={src}
            width={600}
            height={400}
            className="rounded-lg object-contain max-w-full max-h-full"
            alt="image preview"
            priority
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
