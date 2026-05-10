import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/cart_service.dart';
import '../services/auth_service.dart';
import '../models/cart_item.dart';
import '../services/coffee_status_service.dart';
import '../utils/colors.dart';
import '../widgets/app_buttons.dart';
import '../widgets/work_status_banner.dart';
import 'auth_screen.dart';
import 'dart:convert';

import 'checkout_screen.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _init();
    });
  }

  Future<void> _init() async {
    final auth = context.read<AuthService>();

    if (auth.status == AuthStatus.authenticated) {
      await context.read<CartService>().loadCart();
    }
  }

  Future<void> _loginIfNeeded() async {
    final auth = context.read<AuthService>();

    if (auth.status == AuthStatus.authenticated) return;

    await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const AuthScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,

      appBar: AppBar(
        title: const Text('Корзина'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.brown,
        elevation: 0,
        surfaceTintColor: Colors.white,
        scrolledUnderElevation: 0,
      ),
      body: Consumer3<CartService, AuthService, CoffeeStatusService>(
        builder: (context, cart, auth, coffee, _) {
          if (auth.status == AuthStatus.loading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (auth.status == AuthStatus.unauthenticated) {
            return _buildAuthRequired();
          }

          if (cart.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (cart.items.isEmpty) {
            return _buildEmpty();
          }

          return _buildCart(cart, coffee);
        },
      ),
    );
  }

  // ================= AUTH =================

  Widget _buildAuthRequired() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock_outline, size: 80, color: Colors.grey),
            const SizedBox(height: 12),
            const Text(
              'Войдите, чтобы использовать корзину',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _loginIfNeeded,
              style: AppButtons.primary,
              child: const Text('Войти'),
            ),
          ],
        ),
      ),
    );
  }

  // ================= EMPTY =================

  Widget _buildEmpty() {
    return const Center(
      child: Text(
        'Корзина пуста',
        style: TextStyle(color: Colors.grey),
      ),
    );
  }

  // ================= CART =================

  Widget _buildCart(
      CartService cart,
      CoffeeStatusService coffee,
      ) {
    return Column(
      children: [
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.all(12),
            itemCount: cart.items.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final item = cart.items[index];

              return _CartItemTile(
                item: item,
                onInc: () => cart.updateQuantity(item.id, item.count + 1),
                onDec: () => _handleDecrease(cart, item),
                onDelete: () => _confirmDelete(cart, item.id),
              );
            },
          ),
        ),

        _CheckoutBar(
          cart: cart,
          canOrder: coffee.canOrder,
          statusText: coffee.statusText,
        ),
      ],
    );
  }

  void _handleDecrease(CartService cart, CartItem item) {
    if (item.count > 1) {
      cart.updateQuantity(item.id, item.count - 1);
    } else {
      _confirmDelete(cart, item.id);
    }
  }

  void _confirmDelete(CartService cart, int id) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        title: const Text('Удалить товар?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Отмена'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              cart.removeItem(id);
            },
            style: AppButtons.danger,
            child: const Text('Удалить'),
          ),
        ],
      ),
    );
  }
}

// ================= ITEM =================

class _CartItemTile extends StatelessWidget {
  final CartItem item;
  final VoidCallback onInc;
  final VoidCallback onDec;
  final VoidCallback onDelete;

  const _CartItemTile({
    required this.item,
    required this.onInc,
    required this.onDec,
    required this.onDelete,
  });

  List<Map<String, dynamic>> _parseModifiers(String? jsonStr) {
    if (jsonStr == null || jsonStr.isEmpty) return [];

    try {
      final decoded = jsonDecode(jsonStr);
      return List<Map<String, dynamic>>.from(decoded);
    } catch (_) {
      return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    final modifiers = _parseModifiers(item.selectedModifiers);

    final modifiersTotal = modifiers.fold<double>(
      0,
          (sum, m) => sum + ((m["price"] ?? 0) as num).toDouble(),
    );

    final totalPrice = (item.price + modifiersTotal) * item.count;

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// INFO
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// Название
                  Text(
                    item.productName,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),

                  /// Модификаторы
                  if (modifiers.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    ...modifiers.map((m) => Text(
                      '+ ${m["name"]} (${(m["price"] as num).toStringAsFixed(0)} ₽)',
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.grey,
                      ),
                    )),
                  ],

                  const SizedBox(height: 6),

                  /// Цена
                  Text(
                    '${totalPrice.toStringAsFixed(0)} ₽',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.brown,
                    ),
                  ),
                ],
              ),
            ),

            /// QTY CONTROL
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  IconButton(
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.all(6),
                    onPressed: onDec,
                    icon: const Icon(Icons.remove, size: 18),
                  ),
                  Text(
                    '${item.count}',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  IconButton(
                    constraints: const BoxConstraints(),
                    padding: const EdgeInsets.all(6),
                    onPressed: onInc,
                    icon: const Icon(Icons.add, size: 18),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 6),

            /// DELETE
            IconButton(
              onPressed: onDelete,
              icon: const Icon(Icons.delete_outline, color: Colors.red),
            ),
          ],
        ),
      ),
    );
  }
}

// ================= CHECKOUT =================

class _CheckoutBar extends StatelessWidget {
  final CartService cart;
  final bool canOrder;
  final String statusText;

  const _CheckoutBar({
    required this.cart,
    required this.canOrder,
    required this.statusText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black12, blurRadius: 10),
        ],
      ),
      child: SafeArea(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Итого:'),
                Text(
                  '${cart.finalPrice.toStringAsFixed(2)} ₽',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.brown,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            WorkStatusBanner(
              canOrder: canOrder,
              statusText: statusText,
            ),

            const SizedBox(height: 12),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: cart.items.isEmpty || !canOrder
                    ? null
                    : () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const CheckoutScreen(),
                        ),
                      );
                },
                style: AppButtons.primary,
                child: const Text('Оформить заказ'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}