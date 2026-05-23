import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/order.dart';
import '../services/api_service.dart';
import '../services/coffee_status_service.dart';
import '../services/order_service.dart';
import '../services/order_status_extension.dart';
import '../utils/colors.dart';
import '../widgets/app_buttons.dart';

class OrderDetailScreen extends StatefulWidget {
  final Order order;

  const OrderDetailScreen({
    super.key,
    required this.order,
  });

  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {

  static const _sectionTitleStyle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
  );

  static const _bodyStyle = TextStyle(
    fontSize: 16,
  );

  Future<void> _cancelOrder() async {
    final api = context.read<ApiService>();

    try {
      await api.cancelOrder(widget.order.id);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Заказ отменён')),
      );

      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final coffee = context.watch<CoffeeStatusService>();
    final shop = coffee.shop;
    return Scaffold(
      backgroundColor: Colors.grey.shade50,

      appBar: AppBar(
        title: Text('Заказ #${widget.order.orderNumber}'),
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

            /// HEADER
            _SectionCard(
              child: Column(
                children: [
                  Icon(
                    widget.order.status.icon,
                    size: 48,
                    color: widget.order.status.color,
                  ),

                  const SizedBox(height: 12),

                  Text(
                    widget.order.status.displayName,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: widget.order.status.color,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Время выдачи',
                        style: _bodyStyle,
                      ),

                      Text(
                        _formatTime(toMoscowTime(widget.order.pickupTime)),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: AppColors.brown,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Номер заказа',
                        style: _bodyStyle,
                      ),

                      Text(
                        '#${widget.order.orderNumber}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            /// READY INFO
            if (widget.order.status == OrderStatus.ready) ...[
              const SizedBox(height: 16),

              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: Colors.green.shade200,
                  ),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.done_all,
                      color: Colors.green.shade700,
                      size: 32,
                    ),

                    const SizedBox(height: 8),

                    Text(
                      'Ваш заказ готов к выдаче',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.green.shade700,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 6),

                    Text(
                      'Назовите номер заказа бариста',
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.green.shade700,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 16),

            /// ITEMS
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Состав заказа',
                    style: _sectionTitleStyle,
                  ),

                  const SizedBox(height: 16),

                  ...widget.order.items.map(
                        (item) => Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: _OrderItemTile(item: item),
                    ),
                  ),
                ],
              ),
            ),

            /// CLIENT COMMENT
            if (widget.order.clientComment != null &&
                widget.order.clientComment!.trim().isNotEmpty) ...[
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

                    Text(
                      widget.order.clientComment!,
                      style: _bodyStyle,
                    ),
                  ],
                ),
              ),
            ],

            /// BARISTA COMMENT
            if (widget.order.baristaComment != null &&
                widget.order.baristaComment!.trim().isNotEmpty) ...[
              const SizedBox(height: 16),

              _SectionCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Комментарий бариста',
                      style: _sectionTitleStyle,
                    ),

                    const SizedBox(height: 12),

                    Text(
                      widget.order.baristaComment!,
                      style: _bodyStyle,
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 16),

            /// PAYMENT
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Оплата',
                    style: _sectionTitleStyle,
                  ),

                  const SizedBox(height: 16),

                  _PaymentRow(
                    title: 'Сумма заказа',
                    value:
                    '${widget.order.totalPrice.toStringAsFixed(0)} ₽',
                  ),

                  if (widget.order.bonusUsed > 0) ...[
                    const SizedBox(height: 10),

                    _PaymentRow(
                      title: 'Бонусов к списанию',
                      value:
                      '- ${widget.order.bonusUsed.toStringAsFixed(0)} ₽',
                      valueColor: Colors.green,
                    ),
                  ],

                  const SizedBox(height: 10),

                  _PaymentRow(
                    title: 'Бонусов к начислению',
                    value:
                    '+ ${widget.order.bonusEarned.toStringAsFixed(0)}',
                    valueColor: AppColors.brown,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            /// INFO
            _SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Информация',
                    style: _sectionTitleStyle,
                  ),

                  const SizedBox(height: 16),

                  _InfoRow(
                    title: 'Создан',
                    value: _formatDate(widget.order.createdAt),
                  ),

                  const SizedBox(height: 8),

                  _InfoRow(
                    title: 'Адресс кофейни',
                    value: shop!.adress,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            if (widget.order.status == OrderStatus.pending ||
                widget.order.status == OrderStatus.confirmed)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _cancelOrder,
                  style: AppButtons.danger,
                  child: const Text('Отменить заказ'),
                ),
              )
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime dt) {
    final h = dt.hour.toString().padLeft(2, '0');
    final m = dt.minute.toString().padLeft(2, '0');

    return '$h:$m';
  }

  String _formatDate(DateTime dt) {
    final d = dt.day.toString().padLeft(2, '0');
    final m = dt.month.toString().padLeft(2, '0');

    final h = dt.hour.toString().padLeft(2, '0');
    final min = dt.minute.toString().padLeft(2, '0');

    return '$d.$m.${dt.year}, $h:$min';
  }
}

class _OrderItemTile extends StatelessWidget {
  final OrderItem item;

  const _OrderItemTile({
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          /// TITLE
          Row(
            children: [
              Expanded(
                child: Text(
                  item.productName,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),

              Text(
                '${item.count} × ${item.price.toStringAsFixed(0)} ₽',
                style: const TextStyle(
                  fontSize: 15,
                  color: Colors.black87,
                ),
              ),
            ],
          ),

          /// MODIFIERS
          if (item.selectedModifiers != null &&
              item.selectedModifiers!.isNotEmpty) ...[
            const SizedBox(height: 10),

            ...item.selectedModifiers!.map(
                  (m) => Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  '+ ${m.name}'
                      '${m.price > 0 ? ' (${m.price.toStringAsFixed(0)} ₽)' : ''}',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey.shade700,
                  ),
                ),
              ),
            ),
          ],

          const SizedBox(height: 12),

          Align(
            alignment: Alignment.centerRight,
            child: Text(
              '${item.totalPrice.toStringAsFixed(0)} ₽',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.brown,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PaymentRow extends StatelessWidget {
  final String title;
  final String value;
  final Color? valueColor;

  const _PaymentRow({
    required this.title,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment:
      MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16),
        ),

        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: valueColor,
          ),
        ),
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String title;
  final String value;

  const _InfoRow({
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment:
      MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 16,
            color: Colors.grey.shade700,
          ),
        ),

        const SizedBox(width: 12),

        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}

class _SectionCard extends StatelessWidget {
  final Widget child;

  const _SectionCard({
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: child,
    );
  }
}