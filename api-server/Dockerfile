# Dockerfile
# Language: Dockerfile

# Step 0: Define build-time argument for base image with valid default
ARG IMAGE_BASE_RUNTIME=mcr.microsoft.com/dotnet/aspnet:8.0
ARG IMAGE_BASE_SDK=mcr.microsoft.com/dotnet/sdk:8.0

# Step 1: Runtime image for lightweight execution
FROM ${IMAGE_BASE_RUNTIME} AS base
WORKDIR /app
EXPOSE 8080

# Step 2: SDK image to build the application
FROM ${IMAGE_BASE_SDK} AS build
WORKDIR /src

# Copy project file and restore dependencies before copying all source files
COPY ["PhotoWepApi/PhotoWepApi.csproj", "./"]
RUN dotnet restore "PhotoWepApi/PhotoWepApi.csproj"

# Copy the remaining source files and build
COPY . ./
RUN dotnet build "PhotoWepApi/PhotoWepApi.csproj" -c Release -o /app/build

# Step 3: Publish optimized binaries
FROM build AS publish
RUN dotnet publish "PhotoWepApi/PhotoWepApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Step 4: Assemble final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish ./
ENTRYPOINT ["dotnet", "PhotoWepApi.dll"]
