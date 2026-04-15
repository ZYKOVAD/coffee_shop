import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../models/modifier.dart';
import '../services/api_service.dart';
import '../services/cart_service.dart';
import '../services/auth_service.dart';
import 'auth_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final ApiService _apiService = ApiService();

  List<Modifier> _modifiers = [];
  List<Modifier> _selectedModifiers = [];
  int _quantity = 1;
  bool _isLoading = true;
  bool _isAddingToCart = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadModifiers();
  }

  Future<void> _loadModifiers() async {
    try {
      final modifiers = await _apiService.getModifiersByProduct(widget.product.id);
      setState(() {
        _modifiers = modifiers;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  double get _subtotal {
    double sum = widget.product.price * _quantity;
    for (var modifier in _selectedModifiers) {
      sum += modifier.price * _quantity;
    }
    return sum;
  }

  void _toggleModifier(Modifier modifier) {
    setState(() {
      if (_selectedModifiers.contains(modifier)) {
        _selectedModifiers.remove(modifier);
      } else {
        _selectedModifiers.add(modifier);
      }
    });
  }

  void _incrementQuantity() {
    // Проверка для поштучных товаров
    if (widget.product.countInStock != null &&
        widget.product.countInStock! > 0 &&
        _quantity >= widget.product.countInStock!) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Доступно только ${widget.product.countInStock} шт.'),
          duration: const Duration(seconds: 2),
        ),
      );
      return;
    }
    setState(() {
      _quantity++;
    });
  }

  void _decrementQuantity() {
    if (_quantity > 1) {
      setState(() {
        _quantity--;
      });
    }
  }

  Future<void> _addToCart() async {
    final authService = context.read<AuthService>();

    // Проверка авторизации
    if (!authService.isLoggedIn) {
      final shouldLogin = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Требуется авторизация'),
          content: const Text('Войдите или зарегистрируйтесь, чтобы добавить товар в корзину'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Отмена'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6F4E37),
              ),
              child: const Text('Войти'),
            ),
          ],
        ),
      );

      if (shouldLogin == true) {
        final result = await Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const AuthScreen(showCloseButton: true)),
        );
        if (result != true) return;
      } else {
        return;
      }
    }

    // Проверка наличия товара
    if (!widget.product.isAvailable) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Товар временно недоступен'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Проверка количества для поштучных
    if (widget.product.countInStock != null &&
        widget.product.countInStock! > 0 &&
        _quantity > widget.product.countInStock!) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Доступно только ${widget.product.countInStock} шт.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isAddingToCart = true;
    });

    try {
      final cartService = context.read<CartService>();

      // Формируем JSON с выбранными модификаторами
      final modifiersJson = _selectedModifiers.map((m) => {
        'id': m.id,
        'name': m.name,
        'price': m.price,
      }).toList();

      await cartService.addToCart(
        productId: widget.product.id,
        count: _quantity,
        selectedModifiers: modifiersJson.isNotEmpty ? modifiersJson.toString() : null,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${widget.product.name} добавлен в корзину'),
            duration: const Duration(seconds: 2),
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Ошибка: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isAddingToCart = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.product.name),
        backgroundColor: const Color(0xFF6F4E37),
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? _buildErrorWidget()
          : SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Изображение
            _buildImage(),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Название и цена
                  _buildTitleAndPrice(),

                  const SizedBox(height: 16),

                  // Описание
                  _buildDescription(),

                  const SizedBox(height: 24),

                  // Информация о наличии
                  _buildStockInfo(),

                  const SizedBox(height: 24),

                  // Модификаторы
                  if (_modifiers.isNotEmpty) _buildModifiersSection(),

                  const SizedBox(height: 24),

                  // Выбор количества
                  _buildQuantitySelector(),

                  const SizedBox(height: 32),

                  // Итого и кнопка добавления
                  _buildCheckoutSection(),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImage() {
    return SizedBox(
      height: 300,
      width: double.infinity,
      child: widget.product.imgUrl.isNotEmpty
          ? CachedNetworkImage(
        imageUrl: widget.product.imgUrl,
        fit: BoxFit.cover,
        placeholder: (context, url) => Container(
          color: Colors.brown[50],
          child: const Center(
            child: CircularProgressIndicator(),
          ),
        ),
        errorWidget: (context, url, error) => Container(
          color: Colors.brown[50],
          child: const Icon(
            Icons.image_not_supported,
            size: 60,
            color: Colors.grey,
          ),
        ),
      )
          : Container(
        color: Colors.brown[50],
        child: const Icon(
          Icons.coffee,
          size: 80,
          color: Color(0xFF6F4E37),
        ),
      ),
    );
  }

  Widget _buildTitleAndPrice() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            widget.product.name,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFF6F4E37).withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            '${widget.product.price.toStringAsFixed(2)} ₽',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF6F4E37),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDescription() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Описание',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          widget.product.description,
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey[600],
            height: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildStockInfo() {
    if (!widget.product.showStockInfo) return const SizedBox();

    final isOutOfStock = widget.product.countInStock == 0;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: BoxDecoration(
        color: isOutOfStock
            ? Colors.red.withOpacity(0.1)
            : Colors.green.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isOutOfStock ? Colors.red.withOpacity(0.3) : Colors.green.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            isOutOfStock ? Icons.error_outline : Icons.check_circle_outline,
            color: isOutOfStock ? Colors.red : Colors.green,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              widget.product.stockText,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: isOutOfStock ? Colors.red : Colors.green,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModifiersSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Добавки и сиропы',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Выберите дополнительные ингредиенты',
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
        const SizedBox(height: 12),
        ..._modifiers.map((modifier) => _buildModifierTile(modifier)),
      ],
    );
  }

  Widget _buildModifierTile(Modifier modifier) {
    final isSelected = _selectedModifiers.contains(modifier);

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: isSelected ? const Color(0xFF6F4E37) : Colors.grey[300]!,
          width: isSelected ? 2 : 1,
        ),
      ),
      child: CheckboxListTile(
        title: Text(
          modifier.name,
          style: TextStyle(
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        subtitle: Text('+${modifier.price.toStringAsFixed(2)} ₽'),
        value: isSelected,
        onChanged: (value) => _toggleModifier(modifier),
        activeColor: const Color(0xFF6F4E37),
        checkboxShape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 8),
      ),
    );
  }

  Widget _buildQuantitySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Количество',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            // Кнопка минус
            InkWell(
              onTap: _decrementQuantity,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[300]!),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.remove, size: 24),
              ),
            ),
            const SizedBox(width: 16),
            // Количество
            SizedBox(
              width: 50,
              child: Text(
                '$_quantity',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 16),
            // Кнопка плюс
            InkWell(
              onTap: _incrementQuantity,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[300]!),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.add, size: 24),
              ),
            ),
            const Spacer(),
            // Стоимость за количество
            if (_quantity > 1)
              Text(
                '${(widget.product.price * _quantity).toStringAsFixed(2)} ₽',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
          ],
        ),
      ],
    );
  }

  Widget _buildCheckoutSection() {
    // Проверка доступности товара
    final isAvailable = widget.product.isAvailable;

    return Column(
      children: [
        // Итого
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.brown[50],
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Итого:',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  if (_selectedModifiers.isNotEmpty)
                    Text(
                      '${widget.product.price.toStringAsFixed(2)} ₽ × $_quantity',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  Text(
                    '${_subtotal.toStringAsFixed(2)} ₽',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF6F4E37),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Кнопка добавления в корзину
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: isAvailable && !_isAddingToCart ? _addToCart : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6F4E37),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isAddingToCart
                ? const SizedBox(
              height: 24,
              width: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            )
                : Text(
              isAvailable ? 'Добавить в корзину' : 'Нет в наличии',
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              _error!,
              style: const TextStyle(color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _loadModifiers,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6F4E37),
              ),
              child: const Text('Попробовать снова'),
            ),
          ],
        ),
      ),
    );
  }
}