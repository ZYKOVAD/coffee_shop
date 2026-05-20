import '../services/img_service.dart';

class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final int categoryId;
  final String imgUrl;
  final bool isActive;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.categoryId,
    required this.imgUrl,
    required this.isActive,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      categoryId: json['categoryId'] ?? json['category_id'] ?? 0,
      imgUrl: json['imgUrl'] ?? json['img_url'] ?? '',
      isActive: json['isActive'] ?? json['is_active'] ?? true,
    );
  }

  String get image => ImageUrlService.resolve(imgUrl);
}