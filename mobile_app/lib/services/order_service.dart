import 'package:timezone/timezone.dart' as tz;

import '../models/working_hours.dart';

final _moscow = tz.getLocation('Europe/Moscow');

class OrderAvailabilityService {
  static tz.TZDateTime now() {
    return tz.TZDateTime.now(_moscow);
  }

  static tz.TZDateTime? firstAvailableSlot(
      WorkingHours wh,
      ) {
    final slots = buildSlots(wh);

    if (slots.isEmpty) return null;

    return slots.first;
  }

  static tz.TZDateTime _roundToNextFiveMinutes(
      tz.TZDateTime time,
      ) {
    final remainder = time.minute % 5;

    final minutesToAdd = remainder == 0
        ? 0
        : 5 - remainder;

    final rounded = time.add(
      Duration(minutes: minutesToAdd),
    );

    return tz.TZDateTime(
      time.location,
      rounded.year,
      rounded.month,
      rounded.day,
      rounded.hour,
      rounded.minute,
    );
  }

  static tz.TZDateTime minAllowedTime(
      WorkingHours wh,
      ) {
    final current = now();

    final open = tz.TZDateTime(
      _moscow,
      current.year,
      current.month,
      current.day,
      wh.openHour,
      wh.openMinute,
    ).add(const Duration(minutes: 5));

    final nowPlus = _roundToNextFiveMinutes(
      current.add(const Duration(minutes: 5)),
    );

    final min = open.isAfter(nowPlus)
        ? open
        : nowPlus;

    return _roundToNextFiveMinutes(min);
  }

  static tz.TZDateTime maxAllowedTime(
      WorkingHours wh,
      ) {
    final current = now();

    return tz.TZDateTime(
      _moscow,
      current.year,
      current.month,
      current.day,
      wh.closeHour,
      wh.closeMinute,
    ).subtract(const Duration(minutes: 10));
  }

  static bool canOrder(WorkingHours wh) {
    if (wh.isClosed) return false;

    final min = minAllowedTime(wh);
    final max = maxAllowedTime(wh);

    return !min.isAfter(max);
  }

  static List<tz.TZDateTime> buildSlots(
      WorkingHours wh,
      ) {
    if (!canOrder(wh)) return [];

    final min = minAllowedTime(wh);
    final max = maxAllowedTime(wh);

    final slots = <tz.TZDateTime>[];

    var t = min;

    while (!t.isAfter(max)) {
      slots.add(t);
      t = t.add(const Duration(minutes: 5));
    }

    return slots;
  }

  static String statusText(WorkingHours wh) {
    if (wh.isClosed) {
      return 'Кофейня сегодня закрыта';
    }

    if (!canOrder(wh)) {
      return 'На сегодня заказы недоступны';
    }

    return 'Можно оформить заказ';
  }
}