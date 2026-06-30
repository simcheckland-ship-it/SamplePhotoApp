# Step 1: Get the lightweight runtime environment
FROM ://microsoft.com AS base
WORKDIR /app
EXPOSE 8080

# Step 2: Get the SDK environment to compile your C# code
FROM ://microsoft.com AS build
WORKDIR /src
COPY ["PhotoWepApi.csproj", "."]
RUN dotnet restore "./PhotoWepApi.csproj"
COPY . .
RUN dotnet build "PhotoWepApi.csproj" -c Release -o /app/build

# Step 3: Publish the optimized code binaries
FROM build AS publish
RUN dotnet publish "PhotoWepApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Step 4: Copy binaries to runtime and set the start command
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PhotoWepApi.dll"]
