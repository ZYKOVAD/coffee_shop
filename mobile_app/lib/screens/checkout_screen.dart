import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:timezone/timezone.dart' as tz;

import '../models/coffee_shop.dart';
import '../services/cart_service.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../services/order_service.dart';
import '../utils/colors.dart';
import '../widgets/app_buttons.dart';
import '../widgets/time_picker_sheet.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  static const _sectionTitleStyle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
  );

  static const _bodyStyle = TextStyle(
    fontSize: 16,
  );

  final _commentController = TextEditingController();

  tz.TZDateTime? _pickupTime;

  CoffeeShop? _coffeeShop;
  bool _loadingHours = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadCoffeeShop();
  }

  Future<void> _loadCoffeeShop() async {
    try {
      final api = context.read<ApiService>();
      final shop = await api.getCoffeeShop();

      final firstSlot =
      OrderAvailabilityService.firstAvailableSlot(
        shop!,
      );

      setState(() {
        _coffeeShop = shop;
        _pickupTime = firstSlot;
        _loadingHours = false;
      });
    } catch (_) {
      setState(() {
        _coffeeShop = null;
        _loadingHours = false;
      });
    }
  }

  Future<void> _selectTime() async {
    if (_pickupTime == null || _coffeeShop == null) {
      return;
    }

    final result = await showModalBottomSheet<tz.TZDateTime>(
      context: context,
      isScrollControlled: true,
      builder: (_) {
        return TimePickerSheet(
          coffeeShop: _coffeeShop!,
          initialTime: _pickupTime!,
        );
      },
    );

    if (result != null) {
      setState(() => _pickupTime = result);
    }
  }

  Future<void> _createOrder() async {
    final cart = context.read<CartService>();
    final auth = context.read<AuthService>();
    final api = context.read<ApiService>();

    final userId = auth.getUserId();
    if (userId == null || _pickupTime == null) {
      return;
    }

    setState(() => _isLoading = true);

    try {

      await api.createOrder(
        pickupTime: _pickupTime!.toUtc(),
        clientComment: _commentController.text.trim(),
        bonusToUse: cart.useBonuses ? cart.bonusToUse : 0,
      );

      await cart.clearCart();

      if (!mounted) return;

      Navigator.pop(context);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Заказ успешно оформлен')),
      );
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка: $e'), backgroundColor: Colors.red),
      );
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartService>();

    return Scaffold(
      backgroundColor: Colors.grey.shade50,

      appBar: AppBar(
        title: const Text('Оформление заказа'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.brown,
        surfaceTintColor: Colors.white,
        scrolledUnderElevation: 0,
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _SectionCard(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Сумма заказа',
                    style: _sectionTitleStyle,),
                  Text(
                    '${cart.finalPrice.toStringAsFixed(0)} ₽',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppColors.brown,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Бонусы',
                    style: _sectionTitleStyle,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Доступно: ${cart.bonusBalance.toStringAsFixed(0)}',
                    style: _bodyStyle,
                  ),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    value: cart.useBonuses,
                    onChanged: cart.bonusBalance <= 0
                        ? null
                        : cart.toggleUseBonuses,
                    activeThumbColor: AppColors.brown,
                    activeTrackColor: AppColors.brown.withOpacity(0.4),
                    title: Text(
                      'Использовать бонусы',
                      style: TextStyle(
                        fontSize: 16,
                        color: cart.bonusBalance <= 0
                            ? Colors.grey
                            : Colors.black,
                      ),
                    ),
                  ),
                  if (cart.useBonuses)
                    Text(
                      'Спишется: ${cart.bonusToUse.toStringAsFixed(0)} ₽',
                      style: _bodyStyle,
                    ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Время получения', style: _sectionTitleStyle),
                  const SizedBox(height: 12),

                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          _pickupTime == null
                              ? 'Загрузка...'
                              : '${_pickupTime!.hour.toString().padLeft(2, '0')}:${_pickupTime!.minute.toString().padLeft(2, '0')}',
                          style: const TextStyle(
                              fontSize: 22, fontWeight: FontWeight.w600),
                        ),
                      ),
                      OutlinedButton(
                        onPressed:_selectTime,
                        style: AppButtons.secondary,
                        child: const Text('Выбрать'),
                      ),
                    ],
                  ),

                  if (_coffeeShop == null && !_loadingHours)
                    const Padding(
                      padding: EdgeInsets.only(top: 8),
                      child: Text(
                        'Не удалось загрузить рабочие часы',
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Комментарий к заказу',
                    style: _sectionTitleStyle,
                  ),

                  const SizedBox(height: 12),

                  TextField(
                    controller: _commentController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: 'Например, 2 ложки сахара',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _createOrder,
                style: AppButtons.primary,
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Подтвердить заказ'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final Widget child;

  const _SectionCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: child,
    );
  }
}