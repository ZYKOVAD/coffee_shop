import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:timezone/timezone.dart' as tz;

import '../models/working_hours.dart';
import '../services/order_service.dart';
import '../widgets/app_buttons.dart';

class TimePickerSheet extends StatefulWidget {
  final WorkingHours workingHours;
  final tz.TZDateTime initialTime;

  const TimePickerSheet({
    super.key,
    required this.workingHours,
    required this.initialTime,
  });

  @override
  State<TimePickerSheet> createState() => _TimePickerSheetState();
}

class _TimePickerSheetState extends State<TimePickerSheet> {
  late final List<tz.TZDateTime> slots;
  late int selectedIndex;

  @override
  void initState() {
    super.initState();

    slots = OrderAvailabilityService.buildSlots(widget.workingHours);

    if (slots.isEmpty) {
      selectedIndex = 0;
      return;
    }

    selectedIndex = slots.indexWhere(
          (t) => !t.isBefore(widget.initialTime),
    );

    if (selectedIndex < 0) selectedIndex = 0;
  }

  void _confirm() {
    Navigator.pop(context, slots[selectedIndex]);
  }

  @override
  Widget build(BuildContext context) {
    if (slots.isEmpty) {
      return SafeArea(
        child: SizedBox(
          height: 220,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 24),
                child: Text(
                  'Нет доступного времени на сегодня',
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                style: AppButtons.primary,
                onPressed: () => Navigator.pop(context),
                child: const Text('Закрыть'),
              )
            ],
          ),
        ),
      );
    }

    return SafeArea(
      child: SizedBox(
        height: 340,
        child: Column(
          children: [
            const SizedBox(height: 12),
            const Text('Выберите время'),

            Expanded(
              child: CupertinoPicker(
                itemExtent: 40,
                scrollController: FixedExtentScrollController(
                  initialItem: selectedIndex,
                ),
                onSelectedItemChanged: (i) {
                  selectedIndex = i;
                },
                children: slots
                    .map((t) => Center(
                  child: Text(
                    '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}',
                  ),
                ))
                    .toList(),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: AppButtons.primary,
                  onPressed: _confirm,
                  child: const Text('Выбрать'),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}