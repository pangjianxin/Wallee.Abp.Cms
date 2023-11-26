import {
  BlogPostDto,
  MediaDescriptorAdminService,
  MediaDescriptorDto,
} from "@/openapi";
import { MediaDatabase } from "@/utils/dexie";

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
    try {
      await MediaDescriptorAdminService.mediaDescriptorAdminDelete({
        id: mediaId,
      });
      return mediaId;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  };

  const replaceContentBlobWithMedia = (
    media: MediaDescriptorDto, //将要插入的真实的媒体资源
    blobUrl: string, //将要替换的blobUrl
    formContent: string //文章内容
  ) => {
    const mediaUrl = `${import.meta.env.VITE_MEDIA_URL}${media.id}`;
    const regex = new RegExp(blobUrl, "g");
    return formContent?.replace(regex, mediaUrl);
  };

  const ensureIndexedDBCleard = async () => {
    const mediaDB = new MediaDatabase();
    const mediasToBeUploaded = await mediaDB.mediasToBeUploaded.toArray();

    if (mediasToBeUploaded && mediasToBeUploaded.length > 0) {
      mediasToBeUploaded.forEach(async (media) => {
        URL.revokeObjectURL(media.blob);
      });
    }
    
    await mediaDB.mediasToBeUploaded.clear();
    await mediaDB.mediasToBeChecked.clear();
  };

  const fetchMediaFromBlogPost = async (blogPost: BlogPostDto) => {
    const mediaDB = new MediaDatabase();
    const domParser = new DOMParser();
    if (blogPost.content) {
      const parsed = domParser.parseFromString(blogPost.content, "text/html");
      const images = parsed.querySelectorAll("img");
      if (images && images.length > 0) {
        images.forEach(async (img) => {
          const mediaUrl = img.src;
          if (
            (await mediaDB.mediasToBeChecked
              .where("mediaDownloadUrl")
              .equals(mediaUrl)
              .count()) === 0
          ) {
            await mediaDB.mediasToBeChecked.add({ mediaDownloadUrl: mediaUrl });
          }
        });
      }
    }
  };

  return {
    uploadMedia,
    removeMedia,
    replaceContentBlobWithMedia,
    ensureIndexedDBCleard,
    fetchMediaFromBlogPost,
  };
};
