class CartItem {
  final int id;
  final int productId;
  final String productName;
  final int count;
  final double price;
  final String? selectedModifiers;
  final String imageUrl;

  CartItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.count,
    required this.price,
    this.selectedModifiers,
    required this.imageUrl,
  });

  double get totalPrice => price * count;

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'],
      productId: json['productId'] ?? json['product_id'] ?? 0,
      productName: json['productName'] ?? json['product_name'] ?? '',
      count: json['count'] ?? 1,
      price: (json['price'] ?? 0).toDouble(),
      selectedModifiers: json['selectedModifiers'] ?? json['selected_modifiers'],
      imageUrl: json['imageUrl'] ?? json['img_url'] ?? '',
    );
  }
}