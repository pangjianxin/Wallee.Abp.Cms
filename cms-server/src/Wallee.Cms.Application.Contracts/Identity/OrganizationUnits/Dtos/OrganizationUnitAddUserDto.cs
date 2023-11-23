using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Wallee.Cms.Identity.OrganizationUnits.Dtos
{
    public class OrganizationUnitAddUserDto
    {
        [Required]
        public List<Guid> UserIds { get; set; } = null!;
    }
}
