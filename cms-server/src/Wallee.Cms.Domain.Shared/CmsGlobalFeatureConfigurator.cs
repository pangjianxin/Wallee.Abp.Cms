using Volo.Abp.GlobalFeatures;
using Volo.Abp.Threading;

namespace Wallee.Cms;

public static class CmsGlobalFeatureConfigurator
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

    public static void Configure()
    {
        OneTimeRunner.Run(() =>
        {
            GlobalFeatureManager.Instance.Modules.CmsKit(cms =>
            {
                cms.EnableAll();
            });
        });
    }
}
