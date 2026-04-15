class AppConstants {
  static const String baseUrl = 'http://10.0.2.2:5001';
  // Для Android эмулятора : 'http://10.0.2.2:5001'
  // Для iOS симулятора: 'http://localhost:5001'

  static const String apiUrl = '$baseUrl/api';

  // Endpoints
  static const String login = '/Auth/login';
  static const String register = '/Auth/register';

  static const String products = '/Products';
  static const String productsActive = '/Products/active';
  static const String productsByCategory = '/Products/category';

  static const String categories = '/Categories';
  static const String categoriesActive = '/Categories/active';

  static const String cart = '/Cart';
  static const String cartAdd = '/Cart/user';
  static const String cartClear = '/Cart/user';

  static const String orders = '/Orders';
  static const String ordersMe = '/Orders/me';

  static const String modifiers = '/Modifiers';
  static const String modifiersByProduct = '/Modifiers/product';

  static const String notifications = '/Notifications';
  static const String userNotifications = '/Notifications/user';

  static const String bonusTransactions = '/BonusTransactions';
  static const String userBonus = '/Users';

  static const String users = '/Users';

  // Storage keys
  static const String authTokenKey = 'auth_token';
  static const String userIdKey = 'user_id';
  static const String userEmailKey = 'user_email';
  static const String userNameKey = 'user_name';
}