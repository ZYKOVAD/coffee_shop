enum OrderStatus {
  pending,
  confirmed,
  preparing,
  ready,
  completed,
  cancelled,
  rejected;

  String get displayName {
    switch (this) {
      case OrderStatus.pending:
        return 'Ожидает';
      case OrderStatus.confirmed:
        return 'Подтверждён';
      case OrderStatus.preparing:
        return 'Готовится';
      case OrderStatus.ready:
        return 'Готов к выдаче';
      case OrderStatus.completed:
        return 'Завершён';
      case OrderStatus.cancelled:
        return 'Отменён';
      case OrderStatus.rejected:
        return 'Отклонён';
    }
  }

  static OrderStatus fromString(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return OrderStatus.pending;
      case 'confirmed':
        return OrderStatus.confirmed;
      case 'preparing':
        return OrderStatus.preparing;
      case 'ready':
        return OrderStatus.ready;
      case 'completed':
        return OrderStatus.completed;
      case 'cancelled':
        return OrderStatus.cancelled;
      case 'rejected':
        return OrderStatus.rejected;
      default:
        return OrderStatus.pending;
    }
  }
}

class Order {
  final int id;
  final int userId;
  final OrderStatus status;
  final double totalPrice;
  final double bonusUsed;
  final double bonusEarned;
  final DateTime pickupTime;
  final String? baristaComment;
  final String? clientComment;
  final DateTime createdAt;
  final List<OrderItem> items;

  Order({
    required this.id,
    required this.userId,
    required this.status,
    required this.totalPrice,
    required this.bonusUsed,
    required this.bonusEarned,
    required this.pickupTime,
    this.baristaComment,
    this.clientComment,
    required this.createdAt,
    required this.items,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      userId: json['userId'] ?? json['user_id'] ?? 0,
      status: OrderStatus.fromString(json['status'] ?? 'pending'),
      totalPrice: (json['totalPrice'] ?? json['total_price'] ?? 0).toDouble(),
      bonusUsed: (json['bonusUsed'] ?? json['bonus_used'] ?? 0).toDouble(),
      bonusEarned: (json['bonusEarned'] ?? json['bonus_earned'] ?? 0).toDouble(),
      pickupTime: DateTime.parse(json['pickupTime'] ?? json['pickup_time']),
      baristaComment: json['baristaComment'] ?? json['barista_comment'],
      clientComment: json['clientComment'] ?? json['client_comment'],
      createdAt: DateTime.parse(json['createdAt'] ?? json['created_at']),
      items: (json['items'] as List?)?.map((i) => OrderItem.fromJson(i)).toList() ?? [],
    );
  }
}

class OrderItem {
  final int id;
  final int productId;
  final String productName;
  final int count;
  final double price;
  final double totalPrice;
  final String? selectedModifiers;

  OrderItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.count,
    required this.price,
    required this.totalPrice,
    this.selectedModifiers,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'],
      productId: json['productId'] ?? json['product_id'] ?? 0,
      productName: json['productName'] ?? json['product_name'] ?? '',
      count: json['count'] ?? 1,
      price: (json['price'] ?? 0).toDouble(),
      totalPrice: (json['totalPrice'] ?? json['total_price'] ?? 0).toDouble(),
      selectedModifiers: json['selectedModifiers'] ?? json['selected_modifiers'],
    );
  }
}