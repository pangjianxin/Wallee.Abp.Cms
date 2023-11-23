import { MediaDescriptorAdminService } from "@/openapi";

export const useMediaManager = () => {
  const uploadMedia = async (file: File) => {
    const media = await MediaDescriptorAdminService.mediaDescriptorAdminCreate({
      entityType: "BlogPost",
      name: file.name,
      formData: {
        File: file,
      },
    });
    return media;
  };

  const removeMedia = async (mediaId: string) => {
    await MediaDescriptorAdminService.mediaDescriptorAdminDelete({
      id: mediaId,
    });
  };

  return { uploadMedia, removeMedia };
};
