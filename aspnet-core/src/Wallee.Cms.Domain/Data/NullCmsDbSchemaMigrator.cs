using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Wallee.Cms.Data;

/* This is used if database provider does't define
 * ICmsDbSchemaMigrator implementation.
 */
public class NullCmsDbSchemaMigrator : ICmsDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
