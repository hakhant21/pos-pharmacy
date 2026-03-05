FROM php:8.2-fpm

# Change to Singapore mirror for faster apt downloads
RUN sed -i 's|http://deb.debian.org|https://mirror.sg.gs|g' /etc/apt/sources.list.d/debian.sources && \
    sed -i 's|http://security.debian.org|https://mirror.sg.gs|g' /etc/apt/sources.list.d/debian.sources

# Install dependencies with retry logic and minimal size
RUN apt-get update -o Acquire::Retries=5 && apt-get install -y --no-install-recommends \
    git \
    curl \
    supervisor \
    cron \
    nano \
    bash \
    build-essential \
    pkg-config \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zlib1g-dev \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql pcntl zip sqlite

# Install and enable Redis extension
RUN pecl install redis \
    && docker-php-ext-enable redis \
    && docker-php-ext-install ext-intl

# Set timezone
ENV TZ='Asia/Yangon'
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Expose PHP-FPM port
EXPOSE 9000

# Run PHP-FPM in foreground
CMD ["php-fpm", "--nodaemonize"]
