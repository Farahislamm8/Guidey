# نبدأ من صورة PHP مع Apache
FROM php:8.2-apache

# تفعيل mod_rewrite عشان .htaccess يشتغل
RUN a2enmod rewrite

# تعديل إعدادات Apache للسماح بـ AllowOverride
RUN sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# تثبيت امتدادات PHP المطلوبة (لو فيه MySQL)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# نسخ ملفات المشروع
COPY . /var/www/html/

# تعيين صلاحيات الملفات
RUN chown -R www-data:www-data /var/www/html

# فتح البورت
EXPOSE 80

# بدء التشغيل
CMD ["apache2-foreground"]
