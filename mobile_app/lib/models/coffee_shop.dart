class CoffeeShop {
  final int id;
  final String adress;

  final int openHour;
  final int openMinute;

  final int closeHour;
  final int closeMinute;

  final bool isActive;

  CoffeeShop({
    required this.id,
    required this.adress,
    required this.openHour,
    required this.openMinute,
    required this.closeHour,
    required this.closeMinute,
    required this.isActive,
  });

  factory CoffeeShop.fromJson(Map<String, dynamic> json) {
    List<int> parse(String t) =>
        t.split(':').map(int.parse).toList();

    final open = parse(json['open']);
    final close = parse(json['close']);

    print(json);

    return CoffeeShop(
      id: json['id'],
      adress: json['adress'],

      openHour: open[0],
      openMinute: open[1],

      closeHour: close[0],
      closeMinute: close[1],

      isActive: json['isActive'] ?? false,
    );
  }
}