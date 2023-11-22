using Wallee.Cms.Samples;
using Xunit;

namespace Wallee.Cms.EntityFrameworkCore.Domains;

[Collection(CmsTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<CmsEntityFrameworkCoreTestModule>
{

}
