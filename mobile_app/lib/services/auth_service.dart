import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';
import 'storage_service.dart';

class AuthService extends ChangeNotifier {
  final StorageService _storage = StorageService();

  bool _isLoading = false;
  String? _error;
  bool _isLoggedIn = false;

  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _isLoggedIn;

  // Инициализация: проверяем, есть ли сохранённый токен
  Future<void> init() async {
    _isLoggedIn = _storage.isLoggedIn();
    notifyListeners();
  }

  // Вход в систему
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.login}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Ваш API может возвращать токен по-разному
        String? token = data['token'];
        if (token == null) token = data['accessToken'];
        if (token == null) token = data['access_token'];

        if (token != null) {
          await _storage.setAuthToken(token);

          // Получаем userId
          int userId = data['userId'] ?? data['id'] ?? 0;
          await _storage.setUserId(userId);

          // Получаем email
          await _storage.setUserEmail(email);

          // Получаем имя
          String userName = data['username'] ?? data['name'] ?? data['userName'] ?? 'Пользователь';
          await _storage.setUserName(userName);

          _isLoggedIn = true;
          _isLoading = false;
          notifyListeners();
          return true;
        } else {
          _error = 'Не удалось получить токен авторизации';
          _isLoading = false;
          notifyListeners();
          return false;
        }
      } else {
        final error = json.decode(response.body);
        _error = error['message'] ?? error['title'] ?? 'Неверный email или пароль';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Ошибка соединения: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Регистрация
  Future<bool> register({
    required String username,
    required String phone,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('${AppConstants.apiUrl}${AppConstants.register}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'phone': phone,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // После регистрации автоматически входим
        return await login(email, password);
      } else {
        final error = json.decode(response.body);
        _error = error['message'] ?? error['title'] ?? 'Ошибка регистрации';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Ошибка соединения: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Выход из системы
  Future<void> logout() async {
    await _storage.clearUserData();
    _isLoggedIn = false;
    notifyListeners();
  }

  // Очистить ошибку
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Получить имя пользователя
  String? getUserName() {
    return _storage.getUserName();
  }

  // Получить email пользователя
  String? getUserEmail() {
    return _storage.getUserEmail();
  }
}