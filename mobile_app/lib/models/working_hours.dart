class WorkingHours {
  final int openHour;
  final int openMinute;
  final int closeHour;
  final int closeMinute;
  final bool isClosed;

  WorkingHours({
    required this.openHour,
    required this.openMinute,
    required this.closeHour,
    required this.closeMinute,
    required this.isClosed,
  });

  factory WorkingHours.fromJson(Map<String, dynamic> json) {
    List<int> parse(String t) =>
        t.split(':').map(int.parse).toList();

    final open = parse(json['openTime']);
    final close = parse(json['closeTime']);

    return WorkingHours(
      openHour: open[0],
      openMinute: open[1],
      closeHour: close[0],
      closeMinute: close[1],
      isClosed: json['isClosed'] ?? false,
    );
  }
}