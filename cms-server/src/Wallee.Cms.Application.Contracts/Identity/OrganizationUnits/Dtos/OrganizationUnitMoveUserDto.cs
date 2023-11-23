using System;
using System.Collections.Generic;
using System.Text;

namespace Wallee.Cms.Identity.OrganizationUnits.Dtos
{
    public class OrganizationUnitMoveUserDto
    {
        public Guid IdentityUserId { get; set; }
        public Guid TargetOrganizationUnitId { get; set; }
        public Guid OriginalOrganiationUnitId { get; set; }
    }
}
