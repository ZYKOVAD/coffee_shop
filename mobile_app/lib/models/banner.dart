import '../services/img_service.dart';

class Banner {
  final int id;
  final String title;
  final String subtitle;
  final String imgUrl;

  Banner({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.imgUrl,
  });

  factory Banner.fromJson(Map<String, dynamic> json) {
    return Banner(
      id: json['id'],
      title: json['title'] ?? '',
      subtitle: json['subtitle'] ?? '',
      imgUrl: json['imgUrl'] ?? '',
    );
  }

  String get image => ImageUrlService.resolve(imgUrl);
}