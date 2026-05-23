import 'dart:convert';
import 'package:flutter/cupertino.dart' hide Banner;
import 'package:http/http.dart' as http;

import '../models/coffee_shop.dart';
import '../utils/constants.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../models/modifier.dart';
import '../models/order.dart';
import '../models/cart_item.dart';
import '../models/user.dart';
import '../models/banner.dart';
import 'storage_service.dart';

class ApiService {
  final StorageService _storage = StorageService();

  Future<Map<String, String>> _headers() async {
    final token = _storage.getAuthToken();

    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> _request(
      String method,
      String endpoint, {
        Map<String, dynamic>? body,
      }) async {
    final url = Uri.parse('${AppConstants.apiUrl}$endpoint');

    final headers = await _headers();

    http.Response response;

    try {
      switch (method) {
        case 'GET':
          response = await http.get(url, headers: headers);
          break;

        case 'POST':
          response = await http.post(
            url,
            headers: headers,
            body: json.encode(body),
          );
          break;

        case 'PUT':
          response = await http.put(
            url,
            headers: headers,
            body: json.encode(body),
          );
          break;

        case 'PATCH':
          response = await http.patch(
            url,
            headers: headers,
            body: json.encode(body),
          );
          break;

        case 'DELETE':
          response = await http.delete(url, headers: headers);
          break;

        default:
          throw Exception('Unsupported method');
      }

      return _handleResponse(response);
    } catch (e) {
      rethrow;
    }
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return json.decode(response.body);
    }

    try {
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? error['title'] ?? 'Ошибка сервера');
    } catch (_) {
      throw Exception('Ошибка: ${response.statusCode}');
    }
  }

  Future<List<Product>> getActiveProducts() async {
    final data = await _request('GET', AppConstants.productsActive);
    return (data as List).map((e) => Product.fromJson(e)).toList();
  }

  Future<List<Product>> getProductsByCategory(int categoryId) async {
    final data = await _request(
      'GET',
      '${AppConstants.productsByCategory}/$categoryId',
    );

    return (data as List).map((e) => Product.fromJson(e)).toList();
  }

  Future<List<Category>> getActiveCategories() async {
    final data = await _request('GET', AppConstants.categoriesActive);
    return (data as List).map((e) => Category.fromJson(e)).toList();
  }

  Future<List<Modifier>> getModifiersByProduct(int productId) async {
    final data = await _request(
      'GET',
      '${AppConstants.modifiersByProduct}/$productId',
    );

    if (data == null) return [];

    if (data is List) {
      return data.map((e) => Modifier.fromJson(e)).toList();
    }

    if (data is Map && data['items'] is List) {
      return (data['items'] as List)
          .map((e) => Modifier.fromJson(e))
          .toList();
    }

    if (data is Map && data['modifiers'] is List) {
      return (data['modifiers'] as List)
          .map((e) => Modifier.fromJson(e))
          .toList();
    }

    return [];
  }

  Future<List<CartItem>> getUserCart(int userId) async {
    final data =
    await _request('GET', '${AppConstants.cart}/user/$userId');

    return (data as List).map((e) => CartItem.fromJson(e)).toList();
  }

  Future<void> addToCart({
    required int userId,
    required int productId,
    int count = 1,
    String? selectedModifiers,
  }) async {
    await _request(
      'POST',
      '${AppConstants.cartAdd}/$userId/add',
      body: {
        'productId': productId,
        'count': count,
        if (selectedModifiers != null)
          'selectedModifiers': selectedModifiers,
      },
    );
  }

  Future<void> updateCartItem({
    required int cartItemId,
    required int count,
    String? selectedModifiers,
  }) async {
    await _request(
      'PUT',
      '${AppConstants.cart}/$cartItemId',
      body: {
        'count': count,
        if (selectedModifiers != null)
          'selectedModifiers': selectedModifiers,
      },
    );
  }

  Future<void> removeCartItem(int cartItemId) async {
    await _request('DELETE', '${AppConstants.cart}/$cartItemId');
  }

  Future<void> clearCart(int userId) async {
    await _request(
      'DELETE',
      '${AppConstants.cartClear}/$userId/clear',
    );
  }

  Future<double> getUserBonus(int userId) async {
    final data = await _request(
      'GET',
      '${AppConstants.userBonus}/$userId/bonus',
    );

    return User.parseBonusFromJson(data);
  }

  Future<List<Order>> getUserOrders(int userId) async {
    final data =
    await _request('GET', '${AppConstants.orders}/user/$userId');

    return (data as List).map((e) => Order.fromJson(e)).toList();
  }

  Future<User> getUser(int userId) async {
    final data =
    await _request('GET', '${AppConstants.users}/$userId');

    return User.fromJson(data);
  }

  Future<void> updateUserName({
    required int userId,
    required String username,
  }) async {
    await _request(
      'PATCH',
      '${AppConstants.users}/$userId/name',
      body: {'username': username},
    );

    await _storage.setUserName(username);
  }

  Future<void> updateUserPhone({
    required int userId,
    required String? phone,
  }) async {
    await _request(
      'PATCH',
      '${AppConstants.users}/$userId/phone',
      body: {'phone': phone},
    );

    await _storage.setUserPhone(phone ?? '');
  }

  Future<void> updateUserEmail({
    required int userId,
    required String email,
  }) async {
    await _request(
      'PATCH',
      '${AppConstants.users}/$userId/email',
      body: {'email': email},
    );

    await _storage.setUserEmail(email);
  }

  Future<void> updateUserPassword({
    required int userId,
    required String oldPassword,
    required String newPassword,
  }) async {
    await _request(
      'PATCH',
      '${AppConstants.users}/$userId/password',
      body: {
        'oldPassword': oldPassword,
        'newPassword': newPassword,
      },
    );
  }

  Future<List<Order>> getMyOrders() async {
    final data = await _request(
      'GET',
      '${AppConstants.orders}/me',
    );

    return (data as List)
        .map((e) => Order.fromJson(e))
        .toList();
  }

  Future<List<Order>> getMyActiveOrders() async {
    final data = await _request(
      'GET',
      '${AppConstants.orders}/me/active',
    );

    return (data as List)
        .map((e) => Order.fromJson(e))
        .toList();
  }

  Future<Order> createOrder({
    required DateTime pickupTime,
    String? clientComment,
    double bonusToUse = 0,
  }) async {
    final data = await _request(
      'POST',
      AppConstants.orders,
      body: {
        'pickupTime': pickupTime.toUtc().toIso8601String(),
        'clientComment': clientComment ?? '',
        'bonusToUse': bonusToUse,
      },
    );

    return Order.fromJson(data);
  }

  Future<void> cancelOrder(int orderId) async {
    await _request('PUT', '/Orders/$orderId/cancel');
  }

  Future<CoffeeShop?> getCoffeeShop() async {
    final data = await _request(
      'GET',
      AppConstants.coffeeShop,
    );

    if (data == null) return null;

    return CoffeeShop.fromJson(data);
  }

  Future<List<Banner>> getBanners() async {
    final data = await _request(
      'GET',
      AppConstants.banners,
    );

    if (data == null) return [];

    return (data as List)
        .map((e) => Banner.fromJson(e))
        .toList();
  }

  Future<List<Product>> getPopularProducts() async {
    final data = await _request(
      'GET',
      AppConstants.popularProducts,
    );

    if (data == null) return [];

    return (data as List)
        .map((e) => Product.fromJson(e))
        .toList();
  }
}