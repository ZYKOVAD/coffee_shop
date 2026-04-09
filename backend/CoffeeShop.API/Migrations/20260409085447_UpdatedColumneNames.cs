using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoffeeShop.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedColumneNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BonusTransactions_Orders_order_id",
                table: "BonusTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_BonusTransactions_Users_user_id",
                table: "BonusTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Products_product_id",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Users_user_id",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_user_id",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_order_id",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_product_id",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_user_id",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_category_id",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "role",
                table: "Users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "bonus_balance",
                table: "Users",
                newName: "Bonus_balance");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "Products",
                newName: "Is_active");

            migrationBuilder.RenameColumn(
                name: "img_url",
                table: "Products",
                newName: "Img_url");

            migrationBuilder.RenameColumn(
                name: "category_id",
                table: "Products",
                newName: "Category_id");

            migrationBuilder.RenameColumn(
                name: "count",
                table: "Products",
                newName: "Count_in_stock");

            migrationBuilder.RenameIndex(
                name: "IX_Products_is_active",
                table: "Products",
                newName: "IX_Products_Is_active");

            migrationBuilder.RenameIndex(
                name: "IX_Products_category_id",
                table: "Products",
                newName: "IX_Products_Category_id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Orders",
                newName: "User_id");

            migrationBuilder.RenameColumn(
                name: "total_price",
                table: "Orders",
                newName: "Total_price");

            migrationBuilder.RenameColumn(
                name: "pickup_time",
                table: "Orders",
                newName: "Pickup_time");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Orders",
                newName: "Created_at");

            migrationBuilder.RenameColumn(
                name: "client_comment",
                table: "Orders",
                newName: "Client_comment");

            migrationBuilder.RenameColumn(
                name: "bonus_used",
                table: "Orders",
                newName: "Bonus_used");

            migrationBuilder.RenameColumn(
                name: "bonus_earned",
                table: "Orders",
                newName: "Bonus_earned");

            migrationBuilder.RenameColumn(
                name: "barista_comment",
                table: "Orders",
                newName: "Barista_comment");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_user_id",
                table: "Orders",
                newName: "IX_Orders_User_id");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_pickup_time",
                table: "Orders",
                newName: "IX_Orders_Pickup_time");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_created_at",
                table: "Orders",
                newName: "IX_Orders_Created_at");

            migrationBuilder.RenameColumn(
                name: "total_price",
                table: "OrderItems",
                newName: "Total_price");

            migrationBuilder.RenameColumn(
                name: "selected_modifiers",
                table: "OrderItems",
                newName: "Selected_modifiers");

            migrationBuilder.RenameColumn(
                name: "product_name",
                table: "OrderItems",
                newName: "Product_name");

            migrationBuilder.RenameColumn(
                name: "product_id",
                table: "OrderItems",
                newName: "Product_id");

            migrationBuilder.RenameColumn(
                name: "order_id",
                table: "OrderItems",
                newName: "Order_id");

            migrationBuilder.RenameColumn(
                name: "count",
                table: "OrderItems",
                newName: "Count_items");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_product_id",
                table: "OrderItems",
                newName: "IX_OrderItems_Product_id");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_order_id",
                table: "OrderItems",
                newName: "IX_OrderItems_Order_id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Notifications",
                newName: "User_id");

            migrationBuilder.RenameColumn(
                name: "is_read",
                table: "Notifications",
                newName: "Is_read");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Notifications",
                newName: "Created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_user_id",
                table: "Notifications",
                newName: "IX_Notifications_User_id");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_created_at",
                table: "Notifications",
                newName: "IX_Notifications_Created_at");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "Categories",
                newName: "Is_active");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "CartItems",
                newName: "User_id");

            migrationBuilder.RenameColumn(
                name: "selected_modifiers",
                table: "CartItems",
                newName: "Selected_modifiers");

            migrationBuilder.RenameColumn(
                name: "product_id",
                table: "CartItems",
                newName: "Product_id");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_user_id",
                table: "CartItems",
                newName: "IX_CartItems_User_id");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_product_id",
                table: "CartItems",
                newName: "IX_CartItems_Product_id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "BonusTransactions",
                newName: "User_id");

            migrationBuilder.RenameColumn(
                name: "order_id",
                table: "BonusTransactions",
                newName: "Order_id");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "BonusTransactions",
                newName: "Created_at");

            migrationBuilder.RenameIndex(
                name: "IX_BonusTransactions_user_id",
                table: "BonusTransactions",
                newName: "IX_BonusTransactions_User_id");

            migrationBuilder.RenameIndex(
                name: "IX_BonusTransactions_order_id",
                table: "BonusTransactions",
                newName: "IX_BonusTransactions_Order_id");

            migrationBuilder.RenameIndex(
                name: "IX_BonusTransactions_created_at",
                table: "BonusTransactions",
                newName: "IX_BonusTransactions_Created_at");

            migrationBuilder.AddForeignKey(
                name: "FK_BonusTransactions_Orders_Order_id",
                table: "BonusTransactions",
                column: "Order_id",
                principalTable: "Orders",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BonusTransactions_Users_User_id",
                table: "BonusTransactions",
                column: "User_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Products_Product_id",
                table: "CartItems",
                column: "Product_id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Users_User_id",
                table: "CartItems",
                column: "User_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_User_id",
                table: "Notifications",
                column: "User_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_Order_id",
                table: "OrderItems",
                column: "Order_id",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_Product_id",
                table: "OrderItems",
                column: "Product_id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_User_id",
                table: "Orders",
                column: "User_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_Category_id",
                table: "Products",
                column: "Category_id",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BonusTransactions_Orders_Order_id",
                table: "BonusTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_BonusTransactions_Users_User_id",
                table: "BonusTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Products_Product_id",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Users_User_id",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_User_id",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_Order_id",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_Product_id",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_User_id",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_Category_id",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "role");

            migrationBuilder.RenameColumn(
                name: "Bonus_balance",
                table: "Users",
                newName: "bonus_balance");

            migrationBuilder.RenameColumn(
                name: "Is_active",
                table: "Products",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "Img_url",
                table: "Products",
                newName: "img_url");

            migrationBuilder.RenameColumn(
                name: "Category_id",
                table: "Products",
                newName: "category_id");

            migrationBuilder.RenameColumn(
                name: "Count_in_stock",
                table: "Products",
                newName: "count");

            migrationBuilder.RenameIndex(
                name: "IX_Products_Is_active",
                table: "Products",
                newName: "IX_Products_is_active");

            migrationBuilder.RenameIndex(
                name: "IX_Products_Category_id",
                table: "Products",
                newName: "IX_Products_category_id");

            migrationBuilder.RenameColumn(
                name: "User_id",
                table: "Orders",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Total_price",
                table: "Orders",
                newName: "total_price");

            migrationBuilder.RenameColumn(
                name: "Pickup_time",
                table: "Orders",
                newName: "pickup_time");

            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "Orders",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "Client_comment",
                table: "Orders",
                newName: "client_comment");

            migrationBuilder.RenameColumn(
                name: "Bonus_used",
                table: "Orders",
                newName: "bonus_used");

            migrationBuilder.RenameColumn(
                name: "Bonus_earned",
                table: "Orders",
                newName: "bonus_earned");

            migrationBuilder.RenameColumn(
                name: "Barista_comment",
                table: "Orders",
                newName: "barista_comment");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_User_id",
                table: "Orders",
                newName: "IX_Orders_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_Pickup_time",
                table: "Orders",
                newName: "IX_Orders_pickup_time");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_Created_at",
                table: "Orders",
                newName: "IX_Orders_created_at");

            migrationBuilder.RenameColumn(
                name: "Total_price",
                table: "OrderItems",
                newName: "total_price");

            migrationBuilder.RenameColumn(
                name: "Selected_modifiers",
                table: "OrderItems",
                newName: "selected_modifiers");

            migrationBuilder.RenameColumn(
                name: "Product_name",
                table: "OrderItems",
                newName: "product_name");

            migrationBuilder.RenameColumn(
                name: "Product_id",
                table: "OrderItems",
                newName: "product_id");

            migrationBuilder.RenameColumn(
                name: "Order_id",
                table: "OrderItems",
                newName: "order_id");

            migrationBuilder.RenameColumn(
                name: "Count_items",
                table: "OrderItems",
                newName: "count");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_Product_id",
                table: "OrderItems",
                newName: "IX_OrderItems_product_id");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_Order_id",
                table: "OrderItems",
                newName: "IX_OrderItems_order_id");

            migrationBuilder.RenameColumn(
                name: "User_id",
                table: "Notifications",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Is_read",
                table: "Notifications",
                newName: "is_read");

            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "Notifications",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_User_id",
                table: "Notifications",
                newName: "IX_Notifications_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_Created_at",
                table: "Notifications",
                newName: "IX_Notifications_created_at");

            migrationBuilder.RenameColumn(
                name: "Is_active",
                table: "Categories",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "User_id",
                table: "CartItems",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Selected_modifiers",
                table: "CartItems",
                newName: "selected_modifiers");

            migrationBuilder.RenameColumn(
                name: "Product_id",
                table: "CartItems",
                newName: "product_id");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_User_id",
                table: "CartItems",
                newName: "IX_CartItems_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_Product_id",
                table: "CartItems",
                newName: "IX_CartItems_product_id");

            migrationBuilder.RenameColumn(
                name: "User_id",
                table: "BonusTransactions",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Order_id",
                table: "BonusTransactions",
                newName: "order_id");

            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "BonusTransactions",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_BonusTransactions_User_id",
                table: "BonusTransactions",
                newName: "IX_BonusTransactions_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_BonusTransactions_Order_id",
                table: "BonusTransactions",
                newName: "IX_BonusTransactions_order_id");

            migrationBuilder.RenameIndex(
                name: "IX_BonusTransactions_Created_at",
                table: "BonusTransactions",
                newName: "IX_BonusTransactions_created_at");

            migrationBuilder.AddForeignKey(
                name: "FK_BonusTransactions_Orders_order_id",
                table: "BonusTransactions",
                column: "order_id",
                principalTable: "Orders",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BonusTransactions_Users_user_id",
                table: "BonusTransactions",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Products_product_id",
                table: "CartItems",
                column: "product_id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Users_user_id",
                table: "CartItems",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_user_id",
                table: "Notifications",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_order_id",
                table: "OrderItems",
                column: "order_id",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_product_id",
                table: "OrderItems",
                column: "product_id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_user_id",
                table: "Orders",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_category_id",
                table: "Products",
                column: "category_id",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
