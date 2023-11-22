using Wallee.Cms.Samples;
using Xunit;

namespace Wallee.Cms.EntityFrameworkCore.Applications;

[Collection(CmsTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<CmsEntityFrameworkCoreTestModule>
{

}
