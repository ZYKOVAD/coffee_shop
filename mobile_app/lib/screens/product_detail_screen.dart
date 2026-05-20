import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../models/product.dart';
import '../models/modifier.dart';
import '../services/api_service.dart';
import '../services/cart_service.dart';
import '../services/auth_service.dart';
import '../utils/colors.dart';
import '../widgets/app_buttons.dart';
import 'auth_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final ApiService _api = ApiService();

  bool _loading = true;
  bool _adding = false;
  String? _error;

  List<Modifier> _modifiers = [];
  final Set<int> _selectedIds = {};

  int _qty = 1;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final mods = await _api.getModifiersByProduct(widget.product.id);
      mods.sort((a, b) => a.price.compareTo(b.price));

      setState(() {
        _modifiers = mods;
        _loading = false;
      });
    } catch (e, stack) {
      debugPrint(e.toString());
      debugPrint(stack.toString());

      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  double get _basePrice => widget.product.price * _qty;

  double get _modifiersPrice => _modifiers
      .where((m) => _selectedIds.contains(m.id))
      .fold(0.0, (sum, m) => sum + m.price * _qty);

  double get _total => _basePrice + _modifiersPrice;

  Future<bool> _ensureAuth() async {
    final auth = context.read<AuthService>();

    if (auth.status == AuthStatus.authenticated) return true;

    await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const AuthScreen()),
    );

    return context.read<AuthService>().status == AuthStatus.authenticated;
  }

  Future<void> _addToCart() async {
    if (!await _ensureAuth()) return;

    setState(() => _adding = true);

    try {
      final cart = context.read<CartService>();

      final selectedMods = _modifiers
          .where((m) => _selectedIds.contains(m.id))
          .toList()
        ..sort((a, b) => a.id.compareTo(b.id));

      final jsonMods = selectedMods.map((m) => {
        "id": m.id,
        "name": m.name,
        "price": m.price,
      }).toList();

      await cart.addToCart(
        productId: widget.product.id,
        count: _qty,
        selectedModifiers: jsonEncode(jsonMods),
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${widget.product.name} добавлен в корзину')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Ошибка: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _adding = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: _buildBody(),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return _buildError();
    }

    return CustomScrollView(
      slivers: [
        _buildAppBar(),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 120), // FIX
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildTitle(),
                const SizedBox(height: 8),
                _buildDescription(),
                const SizedBox(height: 20),
                _buildQuantity(),
                const SizedBox(height: 20),
                _buildModifiers(),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAppBar() {
    final imageUrl = widget.product.image;

    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      backgroundColor: Colors.white,
      foregroundColor: AppColors.brown,
      flexibleSpace: FlexibleSpaceBar(
        background: CachedNetworkImage(
          imageUrl: imageUrl,
          fit: BoxFit.cover,
          placeholder: (_, __) => Container(
            color: Colors.grey.shade200,
          ),
          errorWidget: (_, __, ___) => Container(
            color: AppColors.sandLight,
            child: const Icon(Icons.coffee, size: 80),
          ),
        ),
      ),
    );
  }

  Widget _buildTitle() {
    return Text(
      widget.product.name,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: AppColors.brown,
      ),
    );
  }

  Widget _buildDescription() {
    return Text(
      widget.product.description,
      style: const TextStyle(
        fontSize: 14,
        color: Colors.grey,
        height: 1.4,
      ),
    );
  }

  Widget _buildModifiers() {
    if (_modifiers.isEmpty) return const SizedBox();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Добавки',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        ..._modifiers.map(_modifierTile),
      ],
    );
  }

  Widget _modifierTile(Modifier m) {
    final selected = _selectedIds.contains(m.id);

    return GestureDetector(
      onTap: () {
        setState(() {
          selected
              ? _selectedIds.remove(m.id)
              : _selectedIds.add(m.id);
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? AppColors.sand : Colors.grey.shade300,
            width: selected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Expanded(child: Text(m.name)),
            Text('+${m.price.toStringAsFixed(0)} ₽'),
          ],
        ),
      ),
    );
  }

  Widget _buildQuantity() {
    return Row(
      children: [
        const Text(
          'Количество',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const Spacer(),
        IconButton(
          onPressed: _qty > 1 ? () => setState(() => _qty--) : null,
          icon: const Icon(Icons.remove),
        ),
        Text(
          '$_qty',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        IconButton(
          onPressed: () => setState(() => _qty++),
          icon: const Icon(Icons.add),
        ),
      ],
    );
  }

  Widget  _buildBottomBar() {
    if (_loading || _error != null) return const SizedBox();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black12, blurRadius: 10),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Итого'),
                Text(
                  '${_total.toStringAsFixed(2)} ₽',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.brown,
                  ),
                ),
              ],
            ),

            const SizedBox(width: 12),

            Expanded(
              child: ElevatedButton(
                onPressed: _adding ? null : _addToCart,
                style: AppButtons.primary,
                child: _adding
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('В корзину'),
              ),
            ),
          ],
        )
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error, color: Colors.red, size: 60),
          const SizedBox(height: 10),
          Text(_error ?? 'Ошибка'),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: _load,
            child: const Text('Повторить'),
          )
        ],
      ),
    );
  }
}