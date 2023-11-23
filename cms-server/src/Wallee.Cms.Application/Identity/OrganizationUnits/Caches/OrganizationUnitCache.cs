using System.Collections.Generic;
using Volo.Abp.Caching;
using Wallee.Cms.Identity.OrganizationUnits.Dtos;

namespace Wallee.Cms.Identity.OrganizationUnits.Caches
{
    [CacheName("org-unit-hierarchy")]
    public class OrganizationUnitCache
    {
        public List<OrganizationUnitDto> Items { get; set; } = default!;
    }
}