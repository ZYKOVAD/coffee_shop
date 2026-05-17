import 'package:timezone/timezone.dart' as tz;
import '../models/coffee_shop.dart';

final _moscow = tz.getLocation('Europe/Moscow');

tz.TZDateTime toMoscowTime(DateTime dt) {
  return tz.TZDateTime.from(dt, _moscow);
}

class OrderAvailabilityService {
  static tz.TZDateTime now() {
    return tz.TZDateTime.now(_moscow);
  }

  static tz.TZDateTime? firstAvailableSlot(
      CoffeeShop shop,
      ) {
    final slots = buildSlots(shop);

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
      CoffeeShop shop,
      ) {
    final current = now();

    final open = tz.TZDateTime(
      _moscow,
      current.year,
      current.month,
      current.day,
      shop.openHour,
      shop.openMinute,
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
      CoffeeShop shop,
      ) {
    final current = now();

    return tz.TZDateTime(
      _moscow,
      current.year,
      current.month,
      current.day,
      shop.closeHour,
      shop.closeMinute,
    ).subtract(const Duration(minutes: 10));
  }

  static bool canOrder(CoffeeShop shop) {
    if (!shop.isActive) return false;

    final min = minAllowedTime(shop);
    final max = maxAllowedTime(shop);

    return !min.isAfter(max);
  }

  static List<tz.TZDateTime> buildSlots(
      CoffeeShop shop,
      ) {
    if (!canOrder(shop)) return [];

    final min = minAllowedTime(shop);
    final max = maxAllowedTime(shop);

    final slots = <tz.TZDateTime>[];

    var t = min;

    while (!t.isAfter(max)) {
      slots.add(t);
      t = t.add(const Duration(minutes: 5));
    }

    return slots;
  }

  static String statusText(CoffeeShop shop) {
    if (!shop.isActive) {
      return 'Кофейня сегодня закрыта';
    }

    if (!canOrder(shop)) {
      return 'На сегодня заказы недоступны';
    }

    return 'Можно оформить заказ';
  }
}