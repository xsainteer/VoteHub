FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /app

COPY . .

RUN dotnet restore "VoteHub.sln"

RUN dotnet publish "VoteHub.sln" -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

COPY --from=build /out .

ENTRYPOINT ["dotnet", "Presentation.dll"]