export const isValidVideoUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

export const isConvexStorageUrl = (url: string): boolean => {
  return url.includes("convex.cloud/api/storage");
};

export const createVideoBlobUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    });

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

    return null;
  } catch (error) {
    console.error("Error creating video blob URL:", error);
    return null;
  }
};

export const revokeVideoBlobUrl = (blobUrl: string): void => {
  URL.revokeObjectURL(blobUrl);
};
