class User {
  final int id;
  final String username;
  final String phone;
  final String email;
  final double bonusBalance;
  final String role;

  User({
    required this.id,
    required this.username,
    required this.phone,
    required this.email,
    required this.bonusBalance,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      username: json['username'] ?? json['userName'] ?? '',
      phone: json['phone'] ?? '',
      email: json['email'] ?? '',
      bonusBalance: (json['bonusBalance'] ?? json['bonus_balance'] ?? 0).toDouble(),
      role: json['role'] ?? 'customer',
    );
  }

  static double parseBonusFromJson(Map<String, dynamic> json) {
    return (json['bonusBalance'] ?? json['balance'] ?? json['bonus_balance'] ?? 0).toDouble();
  }
}