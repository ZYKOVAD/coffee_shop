FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем csproj и восстанавливаем зависимости
COPY CoffeeShop.API/CoffeeShop.API.csproj CoffeeShop.API/
RUN dotnet restore CoffeeShop.API/CoffeeShop.API.csproj

# Копируем весь код
COPY CoffeeShop.API/ CoffeeShop.API/

# Собираем приложение
WORKDIR /src/CoffeeShop.API
RUN dotnet publish -c Release -o /app/publish

# Финальный образ
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .

# Запускаем приложение
ENTRYPOINT ["dotnet", "CoffeeShop.API.dll"]