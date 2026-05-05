import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../utils/constants.dart';
import 'storage_service.dart';

enum AuthStatus {
  loading,
  authenticated,
  unauthenticated,
}

class AuthService extends ChangeNotifier {
  final StorageService _storage;
  AuthService(this._storage);

  bool _isLoading = false;
  String? _error;
  AuthStatus _status = AuthStatus.loading;

  bool get isLoading => _isLoading;
  String? get error => _error;
  AuthStatus get status => _status;

  Future<void> init() async {
    final loggedIn = _storage.isLoggedIn();

    _status = loggedIn
        ? AuthStatus.authenticated
        : AuthStatus.unauthenticated;

    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _setLoading(true);

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

        final token = data['token'] ??
            data['accessToken'] ??
            data['access_token'];

        if (token == null) {
          throw Exception('Нет токена');
        }

        await _storage.setAuthToken(token);

        final userId = data['userId'] ?? data['id'] ?? 0;
        await _storage.setUserId(userId);

        final userName = data['username'] ??
            data['name'] ??
            data['userName'] ??
            'Пользователь';

        await _storage.setUserName(userName);
        await _storage.setUserEmail(email);

        _status = AuthStatus.authenticated;
        notifyListeners();
        _setLoading(false);
        return true;
      } else {
        final error = json.decode(response.body);
        _setError(error['message'] ?? 'Ошибка входа');
        return false;
      }
    } catch (e) {
      _setError('Ошибка соединения: $e');
      return false;
    }
  }

  Future<bool> register({
    required String username,
    required String phone,
    required String email,
    required String password,
  }) async {
    _setLoading(true);

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

      if (response.statusCode == 200 ||
          response.statusCode == 201) {
        return await login(email, password);
      } else {
        final error = json.decode(response.body);
        _setError(error['message'] ?? 'Ошибка регистрации');
        return false;
      }
    } catch (e) {
      _setError('Ошибка соединения: $e');
      return false;
    }
  }

  Future<void> logout() async {
    await _storage.clearUserData();

    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    if (value) _error = null;
    notifyListeners();
  }

  void _setError(String message) {
    _error = message;
    _isLoading = false;
    notifyListeners();
  }


  int? getUserId() => _storage.getUserId();
  String? getUserName() => _storage.getUserName();
  String? getUserEmail() => _storage.getUserEmail();
  String? getUserPhone() => _storage.getUserPhone();

  Future<void> setUserPhone(String phone) async {
    await _storage.setUserPhone(phone);
  }
}