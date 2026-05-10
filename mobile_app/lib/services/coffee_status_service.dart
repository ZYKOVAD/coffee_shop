import 'package:flutter/material.dart';

import '../models/working_hours.dart';
import '../services/api_service.dart';
import '../services/order_service.dart';

class CoffeeStatusService extends ChangeNotifier {
  final ApiService _api = ApiService();

  WorkingHours? workingHours;

  bool isLoading = true;

  Future<void> load() async {
    try {
      final data = await _api.getWorkingHours();

      workingHours = data.first;
    } catch (_) {
      workingHours = null;
    }

    isLoading = false;

    notifyListeners();
  }

  bool get canOrder {
    if (workingHours == null) return false;

    return OrderAvailabilityService.canOrder(
      workingHours!,
    );
  }

  String get statusText {
    if (workingHours == null) {
      return 'Не удалось загрузить статус кофейни';
    }

    return OrderAvailabilityService.statusText(
      workingHours!,
    );
  }
}