class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final int categoryId;
  final String imgUrl;
  final bool isActive;
  final int countInStock;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.categoryId,
    required this.imgUrl,
    required this.isActive,
    required this.countInStock,
  });

  bool get isAvailable {
    if (countInStock == -1) return true;
    return countInStock > 0;
  }

  bool get showStockInfo {
    return countInStock > 0;
  }

  String get stockText {
    if (countInStock == -1) return '';
    if (countInStock == 0) return 'Нет в наличии';
    return '$countInStock шт. в наличии';
  }

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      categoryId: json['categoryId'] ?? json['category_id'] ?? 0,
      imgUrl: json['imgUrl'] ?? json['img_url'] ?? '',
      isActive: json['isActive'] ?? json['is_active'] ?? true,
      countInStock: json['countInStock'] ?? json['count_in_stock'] ?? -1,
    );
  }
}