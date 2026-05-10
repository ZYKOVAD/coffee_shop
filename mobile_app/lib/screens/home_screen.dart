import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:provider/provider.dart';

import '../models/order.dart';
import '../services/api_service.dart';
import '../models/product.dart';
import '../services/coffee_status_service.dart';
import '../services/order_status_extension.dart';
import '../widgets/product_card.dart';
import '../utils/colors.dart';
import '../widgets/work_status_banner.dart';
import 'order_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _apiService = ApiService();

  List<Product> _popularProducts = [];
  bool _isLoading = true;
  int _currentBannerIndex = 0;
  String? _error;

  List<Order> _activeOrders = [];
  bool _loadingOrders = true;

  final List<BannerItem> _banners = [
    BannerItem(
      title: 'Новинка!',
      subtitle: 'Лавандовый раф уже в меню',
      color: const Color(0xFF9C27B0),
      icon: Icons.local_cafe,
    ),
    BannerItem(
      title: 'Скидка 20%',
      subtitle: 'На капучино каждый понедельник',
      color: const Color(0xFFFF9800),
      icon: Icons.local_offer,
    ),
    BannerItem(
      title: 'Бонусы',
      subtitle: 'Получай +5% за каждый заказ',
      color: const Color(0xFF4CAF50),
      icon: Icons.card_giftcard,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _loadPopularProducts();
    _loadActiveOrders();
  }

  Future<void> _loadPopularProducts() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final all = await _apiService.getActiveProducts();
      setState(() {
        _popularProducts = all.take(6).toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _loadActiveOrders() async {
    try {
      final orders = await _apiService.getMyActiveOrders();
      setState(() {
        _activeOrders = orders;
      });
    } catch (e) {} finally {
      setState(() {
        _loadingOrders = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,

      appBar: AppBar(
        title: const Text('Casa Busano'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.brown,
        surfaceTintColor: Colors.white,
        scrolledUnderElevation: 0,
      ),

      body: RefreshIndicator(
        onRefresh: _loadPopularProducts,
        child: CustomScrollView(
          slivers: [
            const SliverToBoxAdapter(child: SizedBox(height: 8)),

            SliverToBoxAdapter(child: _buildBanner()),

            SliverToBoxAdapter(child: _buildStatusBanner()),

            SliverToBoxAdapter(child: _buildActiveOrders()),

            SliverToBoxAdapter(child: _buildPopular()),

            if (_isLoading)
              const SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(child: CircularProgressIndicator()),
                ),
              )
            else if (_error != null)
              SliverToBoxAdapter(child: _errorWidget())
            else if (_popularProducts.isEmpty)
                const SliverToBoxAdapter(
                  child: Center(child: Text('Нет товаров')),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  sliver: SliverGrid(
                    delegate: SliverChildBuilderDelegate(
                          (context, i) =>
                          ProductCard(product: _popularProducts[i]),
                      childCount: _popularProducts.length,
                    ),
                    gridDelegate:
                    const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.78,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                  ),
                ),

            const SliverToBoxAdapter(child: SizedBox(height: 80)),
          ],
        ),
      ),
    );
  }

  Widget _buildBanner() {
    return Column(
      children: [
        CarouselSlider(
          options: CarouselOptions(
            height: 160,
            autoPlay: true,
            enlargeCenterPage: true,
            viewportFraction: 0.85,
            onPageChanged: (i, _) => setState(() => _currentBannerIndex = i),
          ),
          items: _banners.map((b) => _bannerCard(b)).toList(),
        ),

        const SizedBox(height: 12),

        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: _banners.asMap().entries.map((e) {
            final active = e.key == _currentBannerIndex;
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: 7,
              height: 7,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: active ? AppColors.sand : Colors.grey.shade300,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStatusBanner() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      child: Consumer<CoffeeStatusService>(
        builder: (context, coffee, _) {
          if (coffee.canOrder) return const SizedBox.shrink();

          return WorkStatusBanner(
            canOrder: coffee.canOrder,
            statusText: coffee.statusText,
          );
        },
      ),
    );
  }

  Widget _bannerCard(BannerItem b) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 6),
      decoration: BoxDecoration(
        color: b.color,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(b.icon, color: Colors.white, size: 40),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    b.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    b.subtitle,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildActiveOrders() {
    if (_loadingOrders) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (_activeOrders.isEmpty) {
      return const SizedBox();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            'Активные заказы',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: AppColors.brown,
            ),
          ),
        ),

        SizedBox(
          height: 150,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            scrollDirection: Axis.horizontal,
            itemCount: _activeOrders.length,
            separatorBuilder: (_, __) => const SizedBox(width: 10),
            itemBuilder: (context, i) {
              final order = _activeOrders[i];

              return _OrderCard(order: order);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPopular() {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 16),
      child: Center(
        child: Text(
          'Популярное',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppColors.brown,
          ),
        ),
      ),
    );
  }

  Widget _errorWidget() {
    return Center(
      child: Column(
        children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 50),
          const SizedBox(height: 10),
          Text(_error ?? ''),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: _loadPopularProducts,
            child: const Text('Повторить'),
          ),
        ],
      ),
    );
  }
}

class BannerItem {
  final String title;
  final String subtitle;
  final Color color;
  final IconData icon;

  BannerItem({
    required this.title,
    required this.subtitle,
    required this.color,
    required this.icon,
  });
}

class _OrderCard extends StatelessWidget {
  final Order order;

  const _OrderCard({required this.order});

  String _buildItemsPreview() {
    final buffer = StringBuffer();

    for (int i = 0; i < order.items.length && i < 2; i++) {
      final item = order.items[i];

      buffer.writeln('• ${item.productName} x${item.count}');

      if (item.selectedModifiers != null &&
          item.selectedModifiers!.isNotEmpty) {
        buffer.writeln(
          '   + ${item.selectedModifiers!.map((m) => m.name).join(', ')}',
        );
      }
    }

    if (order.items.length > 2) {
      buffer.writeln('...');
    }

    return buffer.toString().trim();
  }

  String _formatTime(DateTime dt) {
    final h = dt.hour.toString().padLeft(2, '0');
    final m = dt.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  @override
  Widget build(BuildContext context) {
    final itemsPreview = _buildItemsPreview();

    return Container(
      width: 220,
      height: 150,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => OrderDetailScreen(order: order),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            Text(
              'Заказ #${order.orderNumber}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),

            const SizedBox(height: 6),

            Expanded(
              child: ShaderMask(
                shaderCallback: (rect) {
                  return const LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black,
                      Colors.black,
                      Colors.transparent,
                    ],
                    stops: [0.0, 0.8, 1.0],
                  ).createShader(rect);
                },
                blendMode: BlendMode.dstIn,
                child: Text(
                  itemsPreview,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.black87,
                    height: 1.3,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 6),

            Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: order.status.color,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    order.status.displayName,
                    style: TextStyle(
                      fontSize: 14,
                      color: order.status.color,
                      fontWeight: FontWeight.w500,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 4),

            Text(
              'Время выдачи: ${_formatTime(order.pickupTime)}',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}