import 'package:flutter/material.dart';

class WorkStatusBanner extends StatelessWidget {
  final bool canOrder;
  final String statusText;

  const WorkStatusBanner({
    super.key,
    required this.canOrder,
    required this.statusText,
  });

  @override
  Widget build(BuildContext context) {
    if (canOrder) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 12,
      ),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.info_outline,
            size: 20,
            color: Colors.grey.shade600,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              statusText,
              style: TextStyle(
                fontSize: 16,
                height: 1.3,
                color: Colors.grey.shade700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}