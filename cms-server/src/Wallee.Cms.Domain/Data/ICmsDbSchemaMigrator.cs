using System.Threading.Tasks;

namespace Wallee.Cms.Data;

public interface ICmsDbSchemaMigrator
{
    Task MigrateAsync();
}
