// api_service.dart - Реальные запросы к вашему .NET API

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/modifier.dart';
import '../utils/constants.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../models/user.dart';
import 'storage_service.dart';

class ApiService {
  final StorageService _storage = StorageService();

  // Получить заголовки с токеном авторизации
  Future<Map<String, String>> _getHeaders() async {
    final token = _storage.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Обработка ответа от сервера
  Future<dynamic> _handleResponse(http.Response response) async {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) {
        return null;
      }
      return json.decode(response.body);
    } else {
      String errorMessage;
      try {
        final error = json.decode(response.body);
        errorMessage = error['message'] ?? error['title'] ?? 'Произошла ошибка';
      } catch (e) {
        errorMessage = 'Ошибка сервера: ${response.statusCode}';
      }
      throw Exception(errorMessage);
    }
  }

  // Products

  Future<List<Product>> getActiveProducts() async {
    try {
      print('📡 Запрос к: ${AppConstants.apiUrl}${AppConstants.productsActive}');

      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.productsActive}'),
        headers: await _getHeaders(),
      );

      print('📡 Ответ: ${response.statusCode}');
      print('📡 Тело: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return (data as List).map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Ошибка: ${response.statusCode}');
      }
    } catch (e) {
      print('Ошибка загрузки товаров: $e');
      rethrow;
    }
  }

  Future<List<Product>> getProductsByCategory(int categoryId) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.productsByCategory}/$categoryId'),
        headers: await _getHeaders(),
      );

      final data = await _handleResponse(response);
      return (data as List).map((json) => Product.fromJson(json)).toList();
    } catch (e) {
      print('Ошибка загрузки товаров категории: $e');
      rethrow;
    }
  }

  // Categories

  Future<List<Category>> getActiveCategories() async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.categoriesActive}'),
        headers: await _getHeaders(),
      );

      final data = await _handleResponse(response);
      return (data as List).map((json) => Category.fromJson(json)).toList();
    } catch (e) {
      print('Ошибка загрузки категорий: $e');
      rethrow;
    }
  }

  // Modifiers

  Future<List<Modifier>> getModifiersByProduct(int productId) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.modifiersByProduct}/$productId'),
        headers: await _getHeaders(),
      );

      final data = await _handleResponse(response);

      if (data == null) {
        return [];
      }

      // Обработка разных форматов ответа
      if (data is List) {
        return data.map((json) => Modifier.fromJson(json)).toList();
      } else if (data is Map && data['items'] is List) {
        return (data['items'] as List).map((json) => Modifier.fromJson(json)).toList();
      } else if (data is Map && data['modifiers'] is List) {
        return (data['modifiers'] as List).map((json) => Modifier.fromJson(json)).toList();
      }

      return [];
    } catch (e) {
      print('Ошибка загрузки модификаторов для продукта $productId: $e');
      return [];
    }
  }

  // Cart

  Future<List<dynamic>> getUserCart(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cart}/user/$userId'),
        headers: await _getHeaders(),
      );

      return await _handleResponse(response);
    } catch (e) {
      print('Ошибка загрузки корзины: $e');
      rethrow;
    }
  }

  Future<void> addToCart(int userId, int productId, int count, String? selectedModifiers) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cartAdd}/$userId/add'),
        headers: await _getHeaders(),
        body: json.encode({
          'productId': productId,
          'count': count,
          if (selectedModifiers != null) 'selectedModifiers': selectedModifiers,
        }),
      );

      await _handleResponse(response);
    } catch (e) {
      print('Ошибка добавления в корзину: $e');
      rethrow;
    }
  }

  Future<void> updateCartItem(int cartItemId, int count, String? selectedModifiers) async {
    try {
      final response = await http.put(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cart}/$cartItemId'),
        headers: await _getHeaders(),
        body: json.encode({
          'count': count,
          if (selectedModifiers != null) 'selectedModifiers': selectedModifiers,
        }),
      );

      await _handleResponse(response);
    } catch (e) {
      print('Ошибка обновления корзины: $e');
      rethrow;
    }
  }

  Future<void> removeCartItem(int cartItemId) async {
    try {
      final response = await http.delete(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cart}/$cartItemId'),
        headers: await _getHeaders(),
      );

      await _handleResponse(response);
    } catch (e) {
      print('Ошибка удаления из корзины: $e');
      rethrow;
    }
  }

  Future<void> clearCart(int userId) async {
    try {
      final response = await http.delete(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.cartClear}/$userId/clear'),
        headers: await _getHeaders(),
      );

      await _handleResponse(response);
    } catch (e) {
      print('Ошибка очистки корзины: $e');
      rethrow;
    }
  }

  // Bonus

  Future<double> getUserBonus(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.userBonus}/$userId/bonus'),
        headers: await _getHeaders(),
      );

      final data = await _handleResponse(response);
      return User.parseBonusFromJson(data);
    } catch (e) {
      print('Ошибка загрузки бонусов: $e');
      return 0;
    }
  }

  // Orders

  Future<dynamic> createOrder({
    required int userId,
    required DateTime pickupTime,
    String? clientComment,
    double bonusToUse = 0,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.orders}'),
        headers: await _getHeaders(),
        body: json.encode({
          'userId': userId,
          'pickupTime': pickupTime.toIso8601String(),
          'clientComment': clientComment ?? '',
          'bonusToUse': bonusToUse,
        }),
      );

      return await _handleResponse(response);
    } catch (e) {
      print('Ошибка создания заказа: $e');
      rethrow;
    }
  }

  Future<List<dynamic>> getUserOrders(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.orders}/user/$userId'),
        headers: await _getHeaders(),
      );

      return await _handleResponse(response);
    } catch (e) {
      print('Ошибка загрузки заказов: $e');
      return [];
    }
  }
}