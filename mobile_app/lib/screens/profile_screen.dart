import 'dart:io';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/cart_service.dart';
import '../utils/colors.dart';
import '../widgets/app_buttons.dart';
import 'auth_screen.dart';
import 'order_history_screen.dart';

enum EditField { none, name, phone, email, password }

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _loading = false;
  EditField _editMode = EditField.none;

  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _email = TextEditingController();
  final _oldPass = TextEditingController();
  final _newPass = TextEditingController();

  String _originalName = '';
  String _originalPhone = '';
  String _originalEmail = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _load() {
    final auth = context.read<AuthService>();

    if (auth.status == AuthStatus.unauthenticated) return;

    _originalName = auth.getUserName() ?? '';
    _originalPhone = auth.getUserPhone() ?? '';
    _originalEmail = auth.getUserEmail() ?? '';

    _name.text = _originalName;
    _phone.text = _originalPhone;
    _email.text = _originalEmail;
  }

  void _cancelEdit() {
    setState(() {
      _editMode = EditField.none;

      _name.text = _originalName;
      _phone.text = _originalPhone;
      _email.text = _originalEmail;

      _oldPass.clear();
      _newPass.clear();
    });
  }

  Future<void> _save(EditField field) async {
    final auth = context.read<AuthService>();
    final api = context.read<ApiService>();

    final userId = auth.getUserId();
    if (userId == null) return;

    setState(() => _loading = true);

    try {
      switch (field) {
        case EditField.name:
          await api.updateUserName(userId: userId, username: _name.text);
          _originalName = _name.text;
          break;

        case EditField.phone:
          await api.updateUserPhone(
            userId: userId,
            phone: _phone.text.isEmpty ? null : _phone.text,
          );
          _originalPhone = _phone.text;
          break;

        case EditField.email:
          await api.updateUserEmail(userId: userId, email: _email.text);
          _originalEmail = _email.text;
          break;

        case EditField.password:
          await api.updateUserPassword(
            userId: userId,
            oldPassword: _oldPass.text,
            newPassword: _newPass.text,
          );
          _oldPass.clear();
          _newPass.clear();
          break;

        case EditField.none:
          break;
      }

      setState(() {
        _editMode = EditField.none;
        _loading = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Сохранено')),
        );
      }
    } catch (e) {
      setState(() => _loading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка: $e')),
      );
    }
  }

  Future<void> _logout() async {
    await context.read<AuthService>().logout();
    await context.read<CartService>().loadCart();

    if (!mounted) return;

    Navigator.of(context).popUntil((route) => route.isFirst);
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final cart = context.watch<CartService>();

    return Scaffold(
      backgroundColor: Colors.grey.shade50,

      appBar: AppBar(
        title: const Text('Профиль'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.brown,
        elevation: 0,
        surfaceTintColor: Colors.white,
        scrolledUnderElevation: 0,
      ),
      body: auth.status == AuthStatus.loading
          ? const Center(child: CircularProgressIndicator())
          : auth.status == AuthStatus.unauthenticated
          ? _buildAuthRequired()
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: _authenticatedView(cart),
      ),
    );
  }

  Widget _buildAuthRequired() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.lock_outline, size: 80, color: Colors.grey),
            const SizedBox(height: 12),
            const Text(
              'Войдите, чтобы использовать аккаунт',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _loginIfNeeded,
              style: AppButtons.primary,
              child: const Text('Войти'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _loginIfNeeded() async {
    final auth = context.read<AuthService>();

    if (auth.status == AuthStatus.authenticated) return;

    await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const AuthScreen()),
    );
  }

  Widget _authenticatedView(CartService cart) {
    return Column(
      children: [
        _bonus(cart),

        const SizedBox(height: 10),

        _sectionTitle('Личные данные'),

        _field(
        icon: Icons.person,
        label: 'Имя',
        value: _originalName,
        editing: _editMode == EditField.name,
        controller: _name,
        onEdit: () => setState(() => _editMode = EditField.name),
        onSave: () => _save(EditField.name),
        ),

        _field(
        icon: Icons.phone,
        label: 'Телефон',
        value: _originalPhone.isEmpty ? 'Не указан' : _originalPhone,
        editing: _editMode == EditField.phone,
        controller: _phone,
        onEdit: () => setState(() => _editMode = EditField.phone),
        onSave: () => _save(EditField.phone),
        ),

        _field(
        icon: Icons.email,
        label: 'Email',
        value: _originalEmail,
        editing: _editMode == EditField.email,
        controller: _email,
        onEdit: () => setState(() => _editMode = EditField.email),
        onSave: () => _save(EditField.email),
        ),

        const SizedBox(height: 10),

        _sectionTitle('Безопасность'),

        _password(cart),

        const SizedBox(height: 10),

        _sectionTitle('Активность'),

        _history(),

        const SizedBox(height: 16),

        _logoutBtn(),

        const SizedBox(height: 10),

        _deleteBtn(),
      ],
    );
  }

  Widget _sectionTitle(String t) => Container(
    alignment: Alignment.centerLeft,
    padding: const EdgeInsets.symmetric(vertical: 10),
    child: Text(
      t,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: AppColors.brown,
      ),
    ),
  );

  Widget _field({
    required IconData icon,
    required String label,
    required String value,
    required bool editing,
    required TextEditingController controller,
    required VoidCallback onEdit,
    required VoidCallback onSave,
  }) {
    if (editing) {
      return Card(
        elevation: 0.5,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              TextField(controller: controller),
              const SizedBox(height: 10),
              Row(
                children: [
                  OutlinedButton(
                    onPressed: _cancelEdit,
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.grey.shade300),
                      foregroundColor: AppColors.brown,
                    ),
                    child: const Text('Отмена'),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onSave,
                      style: AppButtons.primary,
                      child: const Text('Сохранить'),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      );
    }

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.brown),
        title: Text(label),
        subtitle: Text(value),
        trailing: TextButton(
          onPressed: onEdit,
          child: const Text(
            'Изменить',
            style: TextStyle(color: AppColors.brown),
          ),
        ),
      ),
    );
  }

  Widget _password(CartService cart) {
    if (_editMode == EditField.password) {
      return Card(
        elevation: 0.5,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              TextField(
                controller: _oldPass,
                decoration: const InputDecoration(labelText: 'Старый пароль'),
                obscureText: true,
              ),
              TextField(
                controller: _newPass,
                decoration: const InputDecoration(labelText: 'Новый пароль'),
                obscureText: true,
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _cancelEdit,
                      child: const Text('Отмена'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _save(EditField.password),
                      style: AppButtons.primary,
                      child: const Text('Изменить'),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      );
    }

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: ListTile(
        leading: const Icon(Icons.lock, color: AppColors.brown),
        title: const Text('Пароль'),
        subtitle: const Text('••••••••'),
        trailing: TextButton(
          onPressed: () => setState(() => _editMode = EditField.password),
          child: const Text(
            'Изменить',
            style: TextStyle(color: AppColors.brown),
          ),
        ),
      ),
    );
  }

  Widget _bonus(CartService cart) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: AppColors.brown.withOpacity(0.2)),
    ),
    child: Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppColors.brown.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(
            Icons.card_giftcard,
            color: AppColors.brown,
          ),
        ),

        const SizedBox(width: 12),

        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Ваши бонусы',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${cart.bonusBalance.toStringAsFixed(0)} ₽',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.brown,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );

  Widget _history() => ListTile(
    leading: const Icon(Icons.history, color: AppColors.brown),
    title: const Text('История заказов'),
    onTap: () {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const OrderHistoryScreen()),
      );
    },
  );

  Widget _logoutBtn() => SizedBox(
    width: double.infinity,
    child: ElevatedButton(
      onPressed: _logout,
      style: AppButtons.primary,
      child: const Text('Выйти'),
    ),
  );

  Widget _deleteBtn() => SizedBox(
    width: double.infinity,
    child: OutlinedButton(
      onPressed: () {},
      style: AppButtons.danger,
      child: const Text('Удалить аккаунт'),
    ),
  );

  Widget _guest() {
    return Scaffold(
      appBar: AppBar(title: const Text('Профиль')),
      body: const Center(child: Text('Войдите в аккаунт')),
    );
  }
}