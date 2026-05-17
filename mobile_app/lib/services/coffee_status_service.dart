import 'package:flutter/material.dart';

import '../models/coffee_shop.dart';
import '../services/api_service.dart';
import '../services/order_service.dart';

class CoffeeStatusService extends ChangeNotifier {
  final ApiService _api = ApiService();

  CoffeeShop? coffeeShop;
  CoffeeShop? get shop => coffeeShop;

  bool isLoading = true;

  Future<void> load() async {
    try {
      final data = await _api.getCoffeeShop();

      coffeeShop = data;
    } catch (_) {
      coffeeShop = null;
    }

    isLoading = false;

    notifyListeners();
  }

  bool get canOrder {
    if (coffeeShop == null) {
      return false;
    }

    return OrderAvailabilityService.canOrder(
      coffeeShop!,
    );
  }

  String get statusText {
    if (coffeeShop == null) {
      return 'Не удалось загрузить статус кофейни';
    }

    return OrderAvailabilityService.statusText(
      coffeeShop!,
    );
  }
}