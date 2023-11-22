using Volo.Abp.Modularity;

namespace Wallee.Cms;

/* Inherit from this class for your domain layer tests. */
public abstract class CmsDomainTestBase<TStartupModule> : CmsTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
