<?php

use App\Http\Controllers\Api\AiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/ai/operator/chat', [AiController::class, 'store'])
    ->middleware(['auth:sanctum', 'throttle:30,1'])
    ->name('api.ai.operator.chat');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
