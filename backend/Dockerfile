FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY CoffeeShop.API/*.csproj ./CoffeeShop.API/
RUN dotnet restore ./CoffeeShop.API/CoffeeShop.API.csproj

COPY CoffeeShop.API/ ./CoffeeShop.API/
RUN dotnet publish ./CoffeeShop.API/CoffeeShop.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "CoffeeShop.API.dll"]