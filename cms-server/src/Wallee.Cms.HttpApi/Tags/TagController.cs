using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Features;
using Volo.Abp.GlobalFeatures;
using Volo.CmsKit.Features;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Public;
using Volo.CmsKit.Tags;

namespace Wallee.Cms.Tags
{
    [RequiresFeature(CmsKitFeatures.TagEnable)]
    [RequiresGlobalFeature(typeof(TagsFeature))]
    [RemoteService(Name = CmsKitPublicRemoteServiceConsts.RemoteServiceName)]
    [Area(CmsKitPublicRemoteServiceConsts.ModuleName)]
    [Route("api/cms-kit/tags")]
    public class TagController(ITagAppService tagAppService) : CmsController, ITagAppService
    {
        protected ITagAppService TagAppService { get; } = tagAppService;

        [HttpGet]
        [Route("{entityType}/{entityId}")]
        public Task<List<TagDto>> GetAllRelatedTagsAsync(string entityType, string entityId)
        {
            return TagAppService.GetAllRelatedTagsAsync(entityType, entityId);
        }

        [HttpGet]
        [Route("popular/{entityType}/{maxCount:int}")]
        public Task<List<PopularTagDto>> GetPopularTagsAsync(string entityType, int maxCount)
        {
            return TagAppService.GetPopularTagsAsync(entityType, maxCount);
        }
    }
}
