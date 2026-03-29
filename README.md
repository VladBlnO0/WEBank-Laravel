# Web application for remote banking

Project
Adding `"laravel/fortify": "^1.36.2"` is valid, but ensure you actually intend to use Fortify for authentication, as Laravel now recommends Laravel Breeze or Jetstream for new projects. If you only need API authentication, Laravel Sanctum (already present) may suffice.

docker compose exec app php artisan migrate:fresh --seed
