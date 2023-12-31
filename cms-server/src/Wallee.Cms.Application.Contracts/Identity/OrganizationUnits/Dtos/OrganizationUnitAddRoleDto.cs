﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Wallee.Cms.Identity.OrganizationUnits.Dtos
{
    public class OrganizationUnitAddRoleDto
    {
        [Required]
        public List<Guid> RoleIds { get; set; } = null!;
    }
}
