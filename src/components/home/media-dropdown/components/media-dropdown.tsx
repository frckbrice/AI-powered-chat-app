import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { ImageIcon, Plus, Video } from "lucide-react";
import { useConversationStore } from "../../../../store/chat-store";
import { MediaImageDialog } from "./media-image-dialog";
import { MediaVideoDialog } from "./media-video-dialog";
import { useMediaUpload } from "../api/media-upload";

const MediaDropdown = () => {
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedConversation } = useConversationStore();
  const { uploadImage, uploadVideo } = useMediaUpload();

  const handleSendImage = async () => {
    if (!selectedImage || !selectedConversation) return;

    setIsLoading(true);
    const success = await uploadImage(selectedImage, selectedConversation._id);
    if (success) {
      setSelectedImage(null);
    }
    setIsLoading(false);
  };

  const handleSendVideo = async () => {
    if (!selectedVideo || !selectedConversation) return;

    setIsLoading(true);
    const success = await uploadVideo(selectedVideo, selectedConversation._id);
    if (success) {
      setSelectedVideo(null);
    }
    setIsLoading(false);
  };

  return (
    <>
      <input
        type="file"
        ref={imageInput}
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files![0])}
        hidden
      />

      <input
        type="file"
        ref={videoInput}
        accept="video/*"
        onChange={(e) => setSelectedVideo(e.target?.files![0])}
        hidden
      />

      {selectedImage && (
        <MediaImageDialog
          isOpen={selectedImage !== null}
          onClose={() => setSelectedImage(null)}
          selectedImage={selectedImage}
          isLoading={isLoading}
          handleSendImage={handleSendImage}
        />
      )}

      {selectedVideo && (
        <MediaVideoDialog
          isOpen={selectedVideo !== null}
          onClose={() => setSelectedVideo(null)}
          selectedVideo={selectedVideo}
          isLoading={isLoading}
          handleSendVideo={handleSendVideo}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Plus className="text-gray-600 dark:text-gray-400" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => imageInput.current!.click()}>
            <ImageIcon size={18} className="mr-1" /> Photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => videoInput.current!.click()}>
            <Video size={20} className="mr-1" />
            Video
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MediaDropdown;
