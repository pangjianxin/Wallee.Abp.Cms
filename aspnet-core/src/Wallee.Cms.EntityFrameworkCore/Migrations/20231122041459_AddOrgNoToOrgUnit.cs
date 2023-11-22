using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wallee.Cms.Migrations
{
    /// <inheritdoc />
    public partial class AddOrgNoToOrgUnit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrgNo",
                table: "AbpOrganizationUnits",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_AbpOrganizationUnits_OrgNo",
                table: "AbpOrganizationUnits",
                column: "OrgNo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AbpOrganizationUnits_OrgNo",
                table: "AbpOrganizationUnits");

            migrationBuilder.DropColumn(
                name: "OrgNo",
                table: "AbpOrganizationUnits");
        }
    }
}
