using Volo.Abp.Modularity;

namespace Wallee.Cms;

public abstract class CmsApplicationTestBase<TStartupModule> : CmsTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
