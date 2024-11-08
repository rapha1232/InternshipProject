using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternshipBackend.Migrations.AuthDB
{
    /// <inheritdoc />
    public partial class ChangedWRITERREADERtoADMINUSER : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "19242ef2-79df-4882-8178-268c16d5f331",
                columns: new[] { "Name", "NormalizedName" },
                values: new object[] { "user", "USER" });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "314ff3af-e379-4278-a767-f517e70131bd",
                columns: new[] { "Name", "NormalizedName" },
                values: new object[] { "admin", "ADMIN" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "19242ef2-79df-4882-8178-268c16d5f331",
                columns: new[] { "Name", "NormalizedName" },
                values: new object[] { "Reader", "READER" });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "314ff3af-e379-4278-a767-f517e70131bd",
                columns: new[] { "Name", "NormalizedName" },
                values: new object[] { "Writer", "WRITER" });
        }
    }
}
