import 'package:flutter/material.dart';

import '../models/order.dart';
import '../utils/colors.dart';

extension OrderStatusExtension on OrderStatus {
  String get displayName {
    switch (this) {
      case OrderStatus.pending:
        return 'Ожидает подтверждения';

      case OrderStatus.confirmed:
        return 'Принят';

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

      case OrderStatus.notPickedUp:
        return 'Не забран';

      case OrderStatus.refunded:
        return 'Возврат';
    }
  }

  Color get color {
    switch (this) {
      case OrderStatus.pending:
        return Colors.orange;

      case OrderStatus.confirmed:
        return Colors.blue;

      case OrderStatus.preparing:
        return Colors.deepOrange;

      case OrderStatus.ready:
        return Colors.green;

      case OrderStatus.completed:
        return Colors.grey;

      case OrderStatus.cancelled:
      case OrderStatus.rejected:
        return Colors.red;

      case OrderStatus.notPickedUp:
        return AppColors.brown;

      case OrderStatus.refunded:
        return Colors.purple;
    }
  }

  IconData get icon {
    switch (this) {
      case OrderStatus.pending:
        return Icons.access_time;

      case OrderStatus.confirmed:
        return Icons.check_circle_outline;

      case OrderStatus.preparing:
        return Icons.coffee;

      case OrderStatus.ready:
        return Icons.done_all;

      case OrderStatus.completed:
        return Icons.check_circle;

      case OrderStatus.cancelled:
      case OrderStatus.rejected:
        return Icons.close;

      case OrderStatus.notPickedUp:
        return Icons.remove_circle_outline;

      case OrderStatus.refunded:
        return Icons.currency_exchange;
    }
  }
}