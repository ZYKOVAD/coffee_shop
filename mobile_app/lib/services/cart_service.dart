import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';
import '../models/cart_item.dart';
import 'storage_service.dart';

class CartService extends ChangeNotifier {
  final StorageService _storage = StorageService();

  List<CartItem> _items = [];
  bool _isLoading = false;
  double _bonusBalance = 0;
  bool _useBonuses = false;
  double _bonusToUse = 0;

  List<CartItem> get items => _items;
  bool get isLoading => _isLoading;
  double get bonusBalance => _bonusBalance;
  bool get useBonuses => _useBonuses;
  double get bonusToUse => _bonusToUse;

  // Общая сумма товаров
  double get totalPrice {
    double sum = 0;
    for (var item in _items) {
      sum += item.totalPrice;
    }
    return sum;
  }

  // Итоговая сумма с учётом бонусов
  double get finalPrice {
    double finalPrice = totalPrice - _bonusToUse;
    return finalPrice < 0 ? 0 : finalPrice;
  }

  // Общее количество товаров
  int get itemCount {
    int count = 0;
    for (var item in _items) {
      count += item.count;
    }
    return count;
  }

  // Загрузить корзину из API (или из тестовых данных)
  Future<void> loadCart() async {
    final userId = _storage.getUserId();
    if (userId == null) {
      // Если пользователь не авторизован, показываем пустую корзину
      _items = [];
      notifyListeners();
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final token = _storage.getAuthToken();
      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cart}/user/$userId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _items = (data as List).map((json) => CartItem.fromJson(json)).toList();
      }

      await _loadBonusBalance();
    } catch (e) {
      print('Ошибка загрузки корзины: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  // Загрузить бонусный баланс
  Future<void> _loadBonusBalance() async {
    final userId = _storage.getUserId();
    if (userId == null) return;

    try {
      final token = _storage.getAuthToken();
      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.userBonus}/$userId/bonus'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _bonusBalance = (data['bonusBalance'] ?? data['balance'] ?? 0).toDouble();
        notifyListeners();
      }
    } catch (e) {
      print('Ошибка загрузки бонусов: $e');
    }
  }

  // Добавить товар в корзину
  Future<void> addToCart({
    required int productId,
    int count = 1,
    String? selectedModifiers,
  }) async {
    final userId = _storage.getUserId();
    if (userId == null) {
      throw Exception('Пользователь не авторизован');
    }

    try {
      final token = _storage.getAuthToken();
      final response = await http.post(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cartAdd}/$userId/add'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'productId': productId,
          'count': count,
          'selectedModifiers': selectedModifiers,
        }),
      );

      if (response.statusCode == 200) {
        await loadCart(); // Перезагружаем корзину
      } else {
        throw Exception('Ошибка добавления в корзину');
      }
    } catch (e) {
      print('Ошибка добавления: $e');
      rethrow;
    }
  }

  // Обновить количество товара
  Future<void> updateQuantity(int cartItemId, int newCount) async {
    if (newCount < 1) return;

    try {
      final token = _storage.getAuthToken();
      final response = await http.put(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cart}/$cartItemId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'count': newCount}),
      );

      if (response.statusCode == 200) {
        await loadCart();
      }
    } catch (e) {
      print('Ошибка обновления количества: $e');
    }
  }

  // Удалить товар из корзины
  Future<void> removeItem(int cartItemId) async {
    try {
      final token = _storage.getAuthToken();
      final response = await http.delete(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cart}/$cartItemId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        await loadCart();
      }
    } catch (e) {
      print('Ошибка удаления: $e');
    }
  }

  // Очистить всю корзину
  Future<void> clearCart() async {
    final userId = _storage.getUserId();
    if (userId == null) return;

    try {
      final token = _storage.getAuthToken();
      await http.delete(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cartClear}/$userId/clear'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      await loadCart();
    } catch (e) {
      print('Ошибка очистки корзины: $e');
    }
  }

  // Включить/выключить использование бонусов
  void toggleUseBonuses(bool value) {
    _useBonuses = value;
    if (_useBonuses) {
      // Можно использовать до 50% от суммы заказа или весь баланс, что меньше
      _bonusToUse = (totalPrice * 0.5) < _bonusBalance ? totalPrice * 0.5 : _bonusBalance;
      _bonusToUse = _bonusToUse > totalPrice ? totalPrice : _bonusToUse;
    } else {
      _bonusToUse = 0;
    }
    notifyListeners();
  }
}