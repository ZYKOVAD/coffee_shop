import '../utils/constants.dart';

class ImageUrlService {
  static String resolve(String url) {
    if (url.isEmpty) return '';

    if (url.startsWith('http')) {
      if (_isLocal(url)) {
        return _replaceLocal(url);
      }
      return url;
    }

    return '${AppConstants.mediaBaseUrl}$url';
  }

  static bool _isLocal(String url) {
    return url.contains('localhost') ||
        url.contains('127.0.0.1');
  }

  static String _replaceLocal(String url) {
    final uri = Uri.parse(url);

    final path = uri.path;

    return '${AppConstants.mediaBaseUrl}$path';
  }
}