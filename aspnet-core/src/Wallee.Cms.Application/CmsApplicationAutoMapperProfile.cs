using AutoMapper;
using Volo.Abp.Identity;
using Wallee.Cms.Identity.OrganizationUnits.Dtos;

namespace Wallee.Cms;

public class CmsApplicationAutoMapperProfile : Profile
{
    public CmsApplicationAutoMapperProfile()
    {
        CreateMap<OrganizationUnit, OrganizationUnitDto>().MapExtraProperties();
    }
}
