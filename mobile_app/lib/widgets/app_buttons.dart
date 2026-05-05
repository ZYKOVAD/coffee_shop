import 'package:flutter/material.dart';
import '../utils/colors.dart';

class AppButtons {
  // 1. Основная тёмная кнопка (добавить в корзину / оформить заказ)
  static final primary = ElevatedButton.styleFrom(
    backgroundColor: AppColors.brown,
    foregroundColor: Colors.white,
    minimumSize: const Size(double.infinity, 50),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    textStyle: const TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w600,
    ),
  );

  // 2. Светлая с тёмной рамкой (выйти из аккаунта)
  static final secondary = OutlinedButton.styleFrom(
    foregroundColor: AppColors.brown,
    side: const BorderSide(color: AppColors.brown),
    minimumSize: const Size(double.infinity, 50),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    textStyle: const TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w600,
    ),
  );

  // 3. Удаление (светлая + красный акцент)
  static final danger = OutlinedButton.styleFrom(
    foregroundColor: Colors.red,
    side: const BorderSide(color: Colors.red),
    minimumSize: const Size(double.infinity, 50),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    textStyle: const TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w600,
    ),
  );
}