import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/order.dart';
import '../services/api_service.dart';
import '../services/order_status_extension.dart';
import '../utils/colors.dart';
import 'order_detail_screen.dart';

class OrderHistoryScreen extends StatefulWidget {
  const OrderHistoryScreen({super.key});

  @override
  State<OrderHistoryScreen> createState() =>
      _OrderHistoryScreenState();
}

class _OrderHistoryScreenState
    extends State<OrderHistoryScreen> {
  late Future<List<Order>> _future;

  @override
  void initState() {
    super.initState();

    _future = context.read<ApiService>().getMyOrders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,

      appBar: AppBar(
        title: const Text('История заказов'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.brown,
        elevation: 0,
        surfaceTintColor: Colors.white,
        scrolledUnderElevation: 0,
      ),

      body: FutureBuilder<List<Order>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState ==
              ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Text(
                'Ошибка: ${snapshot.error}',
              ),
            );
          }

          final orders = snapshot.data ?? [];

          if (orders.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.receipt_long,
                    size: 72,
                    color: Colors.grey.shade400,
                  ),

                  const SizedBox(height: 12),

                  Text(
                    'У вас пока нет заказов',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade700,
                    ),
                  ),
                ],
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: orders.length,
            separatorBuilder: (_, __) =>
            const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final order = orders[index];

              return InkWell(
                borderRadius: BorderRadius.circular(16),

                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) =>
                          OrderDetailScreen(
                            order: order,
                          ),
                    ),
                  );
                },

                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius:
                    BorderRadius.circular(16),
                    border: Border.all(
                      color: Colors.grey.shade200,
                    ),
                  ),

                  child: Column(
                    children: [

                      /// TOP
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                              CrossAxisAlignment
                                  .start,
                              children: [
                                Text(
                                  'Заказ #${order.orderNumber}',
                                  style:
                                  const TextStyle(
                                    fontSize: 18,
                                    fontWeight:
                                    FontWeight
                                        .w700,
                                  ),
                                ),

                                const SizedBox(
                                  height: 4,
                                ),

                                Text(
                                  _formatDate(
                                    order.createdAt,
                                  ),
                                  style: TextStyle(
                                    color: Colors
                                        .grey
                                        .shade600,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          Container(
                            padding:
                            const EdgeInsets
                                .symmetric(
                              horizontal: 10,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: order
                                  .status.color
                                  .withOpacity(
                                0.12,
                              ),
                              borderRadius:
                              BorderRadius
                                  .circular(20),
                            ),
                            child: Text(
                              order
                                  .status.displayName,
                              style: TextStyle(
                                fontWeight:
                                FontWeight.w600,
                                color: order
                                    .status.color,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      /// INFO
                      Column(
                        children: [
                          Row(
                            children: [
                              Text(
                                '${order.totalPrice.toStringAsFixed(0)} ₽',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.brown,
                                ),
                              ),

                              const Spacer(),

                              Icon(
                                Icons.chevron_right,
                                color: Colors.grey.shade400,
                              ),
                            ],
                          ),

                          if (order.bonusEarned > 0 ||
                              order.bonusUsed > 0) ...[
                            const SizedBox(height: 10),

                            Row(
                              children: [

                                if (order.bonusEarned > 0)
                                  Container(
                                    padding:
                                    const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.green
                                          .withOpacity(0.1),
                                      borderRadius:
                                      BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      '+${order.bonusEarned.toStringAsFixed(0)} б',
                                      style: const TextStyle(
                                        color: Colors.green,
                                        fontWeight:
                                        FontWeight.w600,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),

                                if (order.bonusEarned > 0 &&
                                    order.bonusUsed > 0)
                                  const SizedBox(width: 8),

                                if (order.bonusUsed > 0)
                                  Container(
                                    padding:
                                    const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppColors.brown
                                          .withOpacity(0.1),
                                      borderRadius:
                                      BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      '-${order.bonusUsed.toStringAsFixed(0)} б',
                                      style: const TextStyle(
                                        color: AppColors.brown,
                                        fontWeight:
                                        FontWeight.w600,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  String _formatDate(DateTime dt) {
    final d = dt.day.toString().padLeft(2, '0');
    final m = dt.month.toString().padLeft(2, '0');

    return '$d.$m.${dt.year}';
  }

  String _formatTime(DateTime dt) {
    final h = dt.hour.toString().padLeft(2, '0');
    final m = dt.minute.toString().padLeft(2, '0');

    return '$h:$m';
  }
}