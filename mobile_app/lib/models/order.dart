import 'dart:convert';

import 'modifier.dart';

enum OrderStatus {
  pending,
  confirmed,
  preparing,
  ready,
  completed,
  cancelled,
  rejected,
  notPickedUp,
  refunded;

  static OrderStatus fromString(String status) {
    return OrderStatus.values.firstWhere(
          (e) => e.name == status.toLowerCase(),
        orElse: () => OrderStatus.pending,
    );
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
  final int orderNumber;
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
    required this.orderNumber,
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
      orderNumber: json['orderNumber'] ?? json['order_number'] ?? 0,
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
  final List<Modifier>? selectedModifiers;

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
    List<dynamic> modifiersJson = [];

    final raw = json['selectedModifiers'];

    if (raw is String && raw.isNotEmpty) {
      try {
        modifiersJson = jsonDecode(raw);
      } catch (_) {
        modifiersJson = [];
      }
    } else if (raw is List) {
      modifiersJson = raw;
    }

    return OrderItem(
      id: json['id'],
      productId: json['productId'] ?? json['product_id'] ?? 0,
      productName: json['productName'] ?? json['product_name'] ?? '',
      count: json['count'] ?? 1,
      price: (json['price'] ?? 0).toDouble(),
      totalPrice: (json['totalPrice'] ?? json['total_price'] ?? 0).toDouble(),
      selectedModifiers: modifiersJson
          .map((e) => Modifier.fromJson(e))
          .toList(),
    );
  }
}