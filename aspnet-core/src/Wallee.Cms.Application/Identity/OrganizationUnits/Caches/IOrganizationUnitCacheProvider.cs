using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Wallee.Cms.Identity.OrganizationUnits.Dtos;

namespace Wallee.Cms.Identity.OrganizationUnits.Caches
{
    public interface IOrganizationUnitCacheProvider
    {
        Task<OrganizationUnitDto> GetAsync(Guid organizationUnitId);
        Task<OrganizationUnitCache> GetOrAddOrganizationUnitAsync();
        Task<List<OrganizationUnitDto>> GetVisibleOrganizationUnitsAsync(string orgCode, bool containsParents = false);
        Task RefreshAsync();
    }
}
