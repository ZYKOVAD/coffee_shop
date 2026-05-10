import 'package:coffee_app/screens/main_screen.dart';
import 'package:coffee_app/services/coffee_status_service.dart';
import 'package:coffee_app/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/storage_service.dart';
import 'services/auth_service.dart';
import 'services/cart_service.dart';
import 'services/api_service.dart';
import 'package:timezone/data/latest.dart' as tz;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  tz.initializeTimeZones();

  final storage = StorageService();
  await storage.init();

  runApp(MyApp(storage: storage));
}

class MyApp extends StatelessWidget {
  final StorageService storage;

  const MyApp({super.key, required this.storage});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider(create: (_) => ApiService()),

        ChangeNotifierProvider(
          create: (_) {
            final auth = AuthService(storage);
            auth.init();
            return auth;
          },
        ),

        ChangeNotifierProvider(
          create: (_) => CoffeeStatusService()..load(),
        ),

        ChangeNotifierProxyProvider<ApiService, CartService>(
          create: (context) => CartService(
            Provider.of<ApiService>(context, listen: false),
          ),
          update: (context, api, previous) {
            return previous!..updateApi(api);
          },
        ),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        home: const MainScreen(),
        theme: ThemeData(
          useMaterial3: true,

          scaffoldBackgroundColor: AppColors.white,
          canvasColor: AppColors.white,

          colorScheme: const ColorScheme.light(
            background: AppColors.white,
            surface: AppColors.white,
            primary: AppColors.sand,
            secondary: AppColors.sandDark,
          ),

          appBarTheme: const AppBarTheme(
            backgroundColor: AppColors.white,
            foregroundColor: AppColors.brown,
            elevation: 0,
            centerTitle: true,
          ),

        ),
      ),

    );
  }
}