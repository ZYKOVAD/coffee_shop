# Базовый образ с SDK 
FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# Устанавливаем dotnet-watch для hot reload
RUN dotnet tool install -g dotnet-watch
ENV PATH="${PATH}:/root/.dotnet/tools"

# Копируем csproj и восстанавливаем зависимости
COPY CoffeeShop.API/*.csproj ./CoffeeShop.API/
RUN dotnet restore ./CoffeeShop.API/CoffeeShop.API.csproj

# Копируем весь код
COPY CoffeeShop.API/ ./CoffeeShop.API/

# Открываем порт
EXPOSE 80

# Запускаем с hot reload
CMD dotnet watch run --project ./CoffeeShop.API/CoffeeShop.API.csproj --urls "http://0.0.0.0:80"