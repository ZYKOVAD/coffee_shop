import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../widgets/product_card.dart';
import '../utils/colors.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  final ApiService _api = ApiService();

  List<Category> _categories = [];
  List<Product> _products = [];
  List<Product> _filtered = [];

  int _selectedCategoryId = 0;

  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final result = await Future.wait([
        _api.getActiveCategories(),
        _api.getActiveProducts(),
      ]);

      final categories = result[0] as List<Category>;
      final products = result[1] as List<Product>;

      setState(() {
        _categories = categories;
        _products = products;
        _filtered = products;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  void _selectCategory(int id) {
    setState(() {
      _selectedCategoryId = id;

      _filtered = id == 0
          ? _products
          : _products.where((p) => p.categoryId == id).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Меню'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.brown,
        elevation: 0,
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return _buildError();
    }

    return Column(
      children: [
        const SizedBox(height: 12),
        _buildCategories(),
        const SizedBox(height: 12),
        Expanded(child: _buildProducts()),
      ],
    );
  }

  // ================= CATEGORIES =================

  Widget _buildCategories() {
    return SizedBox(
      height: 44,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        children: [
          _CategoryChip(
            label: 'Все',
            selected: _selectedCategoryId == 0,
            onTap: () => _selectCategory(0),
          ),
          ..._categories.map(
                (c) => _CategoryChip(
              label: c.name,
              selected: _selectedCategoryId == c.id,
              onTap: () => _selectCategory(c.id),
            ),
          ),
        ],
      ),
    );
  }



  // ================= PRODUCTS =================

  Widget _buildProducts() {
    if (_filtered.isEmpty) {
      return const Center(
        child: Text(
          'Нет товаров',
          style: TextStyle(color: Colors.grey),
        ),
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.78,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: _filtered.length,
      itemBuilder: (context, index) {
        return ProductCard(product: _filtered[index]);
      },
    );
  }

  // ================= ERROR =================

  Widget _buildError() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 60, color: Colors.red),
            const SizedBox(height: 12),
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.black87),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _load,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.sand,
                foregroundColor: Colors.white,
              ),
              child: const Text('Повторить'),
            ),
          ],
        ),
      ),
    );
  }
}

// ================= CATEGORY CHIP =================

class _CategoryChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _CategoryChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        margin: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? AppColors.brown : Colors.grey.shade300,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? AppColors.brown : Colors.grey,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}