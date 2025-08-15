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
      <DialogContent className="min-w-[750px]">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <DialogDescription className="relative h-[450px] flex justify-center">
          <Image src={src} fill className="rounded-lg object-contain" alt="image" />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
