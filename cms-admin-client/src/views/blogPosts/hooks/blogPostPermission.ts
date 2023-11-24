import { useServerConfigStore } from "@/store/serverConfigStore";
export const useBlogPostPermission = () => {
  const hasPublishPermission = computed(() => {
    const serverConfigStore = useServerConfigStore();
    return serverConfigStore.isPermitted("CmsKit.BlogPosts.Publish");
  });

  return { hasPublishPermission };
};
