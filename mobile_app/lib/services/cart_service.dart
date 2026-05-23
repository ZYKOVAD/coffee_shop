import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../services/api_service.dart';
import 'storage_service.dart';
import 'dart:convert';

class CartService extends ChangeNotifier {
  final StorageService _storage = StorageService();
  ApiService _api;

  CartService(this._api);

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

  double get totalPrice {
    double total = 0;

    for (final item in _items) {
      double modifiersSum = 0;

      if (item.selectedModifiers != null &&
          item.selectedModifiers!.isNotEmpty) {
        try {
          final mods = jsonDecode(item.selectedModifiers!);

          for (final m in mods) {
            modifiersSum += (m["price"] ?? 0).toDouble();
          }
        } catch (_) {}
      }

      total += (item.price + modifiersSum) * item.count;
    }

    return total;
  }

  double get finalPrice {
    final price = totalPrice - _bonusToUse;
    return price < 0 ? 0 : price;
  }

  int get itemCount =>
      _items.fold(0, (count, item) => count + item.count);

  Future<void> loadCart() async {
    final userId = _storage.getUserId();

    if (userId == null) {
      _items = [];
      notifyListeners();
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      _items = await _api.getUserCart(userId);
      _items.sort((a, b) => a.productId.compareTo(b.productId));
      _bonusBalance = await _api.getUserBonus(userId);
    } catch (e) {
      print('Ошибка загрузки корзины: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addToCart({
    required int productId,
    int count = 1,
    String? selectedModifiers,
  }) async {
    final userId = _storage.getUserId();
    if (userId == null) throw Exception('Пользователь не авторизован');

    await _api.addToCart(
      userId: userId,
      productId: productId,
      count: count,
      selectedModifiers: selectedModifiers ?? "[]", // ✅ ВАЖНО
    );

    await loadCart();
  }

  Future<void> updateQuantity(int cartItemId, int newCount) async {
    if (newCount < 1) {
      await removeItem(cartItemId);
      return;
    }

    await _api.updateCartItem(
      cartItemId: cartItemId,
      count: newCount,
    );

    await loadCart();
  }

  Future<void> removeItem(int cartItemId) async {
    await _api.removeCartItem(cartItemId);
    await loadCart();
  }

  Future<void> clearCart() async {
    final userId = _storage.getUserId();
    if (userId == null) return;

    await _api.clearCart(userId);

    _useBonuses = false;
    _bonusToUse = 0;

    await loadCart();
  }

  void toggleUseBonuses(bool value) {
    if (_bonusBalance <= 0) return;

    _useBonuses = value;

    if (_useBonuses) {
      _bonusToUse = (totalPrice * 0.99) < _bonusBalance
          ? totalPrice * 0.99
          : _bonusBalance;

      _bonusToUse =
      _bonusToUse > totalPrice ? totalPrice : _bonusToUse;
    } else {
      _bonusToUse = 0;
    }

    notifyListeners();
  }

  void resetBonuses() {
    _useBonuses = false;
    _bonusToUse = 0;

    notifyListeners();
  }

  void updateApi(ApiService api) {
    _api = api;
  }
}