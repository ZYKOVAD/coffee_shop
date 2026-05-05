import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

import '../services/api_service.dart';
import '../models/product.dart';
import '../widgets/product_card.dart';
import '../utils/colors.dart';

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      appBar: AppBar(
        title: const Text('Casa Busano'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.brown,
      ),

      body: RefreshIndicator(
        onRefresh: _loadPopularProducts,
        child: CustomScrollView(
          slivers: [
            const SliverToBoxAdapter(child: SizedBox(height: 8)),

            SliverToBoxAdapter(child: _buildBanner()),

            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Center(
                  child: Text(
                    'Популярное',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: AppColors.brown,
                    ),
                  ),
                ),
              ),
            ),

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