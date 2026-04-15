import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  late SharedPreferences _prefs;

  // Инициализация (вызывается при запуске приложения)
  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Сохранить токен авторизации
  Future<void> setAuthToken(String token) async {
    await _prefs.setString(AppConstants.authTokenKey, token);
  }

  // Получить токен
  String? getAuthToken() {
    return _prefs.getString(AppConstants.authTokenKey);
  }

  // Удалить токен (при выходе)
  Future<void> removeAuthToken() async {
    await _prefs.remove(AppConstants.authTokenKey);
  }

  // Сохранить ID пользователя
  Future<void> setUserId(int id) async {
    await _prefs.setInt(AppConstants.userIdKey, id);
  }

  // Получить ID пользователя
  int? getUserId() {
    return _prefs.getInt(AppConstants.userIdKey);
  }

  // Сохранить email пользователя
  Future<void> setUserEmail(String email) async {
    await _prefs.setString(AppConstants.userEmailKey, email);
  }

  String? getUserEmail() {
    return _prefs.getString(AppConstants.userEmailKey);
  }

  // Сохранить имя пользователя
  Future<void> setUserName(String name) async {
    await _prefs.setString(AppConstants.userNameKey, name);
  }

  String? getUserName() {
    return _prefs.getString(AppConstants.userNameKey);
  }

  // Очистить все данные пользователя (при выходе)
  Future<void> clearUserData() async {
    await _prefs.remove(AppConstants.authTokenKey);
    await _prefs.remove(AppConstants.userIdKey);
    await _prefs.remove(AppConstants.userEmailKey);
    await _prefs.remove(AppConstants.userNameKey);
  }

  // Проверить, авторизован ли пользователь
  bool isLoggedIn() {
    return getAuthToken() != null && getUserId() != null;
  }
}