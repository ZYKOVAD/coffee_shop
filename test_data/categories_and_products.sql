-- =============================================
-- 1. Очистка таблиц
-- =============================================
TRUNCATE TABLE public."Products" RESTART IDENTITY CASCADE;
TRUNCATE TABLE public."Categories" RESTART IDENTITY CASCADE;

-- =============================================
-- 2. Добавление категорий
-- =============================================
INSERT INTO public."Categories" ("Name", "Is_active") VALUES
    ('Кофе', true),
    ('Чай', true),
    ('Десерты', true),
    ('Лимонады', true);

-- =============================================
-- 3. Добавление продуктов
-- =============================================
-- Кофе (категория id = 1)
INSERT INTO public."Products" ("Category_id", "Name", "Description", "Price", "Img_url", "Is_active", "Count_in_stock") VALUES
    (1, 'Эспрессо 60мл', 'Двойной эспрессо', 180.00, '/images/espresso_double.jpg', true, -1),
    (1, 'Американо 250мл', 'Эспрессо с горячей водой', 180.00, '/images/americano_200.jpg', true, -1),
    (1, 'Американо 350мл', 'Эспрессо с горячей водой, большой объем', 200.00, '/images/americano_300.jpg', true, -1),
    (1, 'Капучино 250мл', 'Кофе с молочной пеной', 230.00, '/images/cappuccino.jpg', true, -1),
    (1, 'Капучино 350мл', 'Кофе с молочной пеной, большой объем', 250.00, '/images/cappuccino_large.jpg', true, -1),
    (1, 'Латте 250мл', 'Нежный кофе с большим количеством молока', 230.00, '/images/latte.jpg', true, -1),
    (1, 'Латте 350мл', 'Нежный кофе с большим количеством молока, большой объем', 250.00, '/images/latte_large.jpg', true, -1),
    (1, 'Раф 350мл', 'Кофе со сливками и ванильным сахаром', 270.00, '/images/raf.jpg', true, -1),
    (1, 'Мокко 350мл', 'Кофе с шоколадным сиропом и молоком', 270.00, '/images/mocca.jpg', true, -1);

-- Чай (категория id = 2)
INSERT INTO public."Products" ("Category_id", "Name", "Description", "Price", "Img_url", "Is_active", "Count_in_stock") VALUES
    (2, 'Чай черный 300мл', 'Классический черный чай', 100.00, '/images/black_tea.jpg', true, -1),
    (2, 'Чай черный 450мл', 'Классический черный чай, большой объем', 130.00, '/images/black_tea_large.jpg', true, -1),
    (2, 'Чай зеленый 300мл', 'Свежий зеленый чай', 100.00, '/images/green_tea.jpg', true, -1),
    (2, 'Чай зеленый 450мл', 'Свежий зеленый чай, большой объем', 130.00, '/images/green_tea_large.jpg', true, -1),
    (2, 'Чай улун 350мл', 'Китайский бирюзовый чай', 160.00, '/images/oolong_tea.jpg', true, -1),
    (2, 'Матча латте 300мл', 'Японский чай матча с молоком', 230.00, '/images/matcha_latte.jpg', true, -1),
    (2, 'Чай с бергамотом 350мл', 'Чай Эрл Грей с нотками бергамота', 120.00, '/images/earl_grey.jpg', true, -1),
    (2, 'Чай каркаде 350мл', 'Красный чай из гибискуса', 130.00, '/images/hibiscus.jpg', true, -1);

-- Десерты (категория id = 3)
INSERT INTO public."Products" ("Category_id", "Name", "Description", "Price", "Img_url", "Is_active", "Count_in_stock") VALUES
    (3, 'Круассан', 'Слоеное изделие с масляным вкусом', 120.00, '/images/croissant.jpg', true, 3),
    (3, 'Круассан с шоколадом', 'Слоеное изделие с шоколадной начинкой', 150.00, '/images/croissant_chocolate.jpg', true, 2),
    (3, 'Чизкейк Нью-Йорк', 'Нежный сливочный чизкейк', 280.00, '/images/cheesecake.jpg', true, 1),
    (3, 'Тирамису', 'Итальянский десерт с маскарпоне и кофе', 290.00, '/images/tiramisu.jpg', true, 1),
    (3, 'Брауни', 'Шоколадное пирожное с орехами', 180.00, '/images/brownie.jpg', true, 1),
    (3, 'Макаронс', 'Французское миндальное печенье (набор 3 шт)', 210.00, '/images/macarons.jpg', true, 3),
    (3, 'Эклер', 'Заварное пирожное с заварным кремом', 160.00, '/images/eclair.jpg', true, 1);

-- Лимонады (категория id = 4)
INSERT INTO public."Products" ("Category_id", "Name", "Description", "Price", "Img_url", "Is_active", "Count_in_stock") VALUES
    (4, 'Классический лимонад 500мл', 'Лимонад с лимоном и мятой', 250.00, '/images/lemonade_classic_large.jpg', true, -1),
    (4, 'Мохито 500мл', 'Освежающий лимонад с лаймом и мятой', 250.00, '/images/mojito.jpg', true, -1),
    (4, 'Клубничный лимонад 500мл', 'Лимонад со свежей клубникой', 250.00, '/images/strawberry_lemonade.jpg', true, -1),
    (4, 'Смородиновый лимонад 500мл', 'Лимонад с черной смородиной', 250.00, '/images/currant_lemonade.jpg', true, -1);
