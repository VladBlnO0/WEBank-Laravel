<?php

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;

test('ai operator chat returns validation error when message is missing', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->postJson(route('api.ai.operator.chat'), [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['message']);
});

test('ai operator chat proxies tool calls from groq response', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    config()->set('services.groq.key', 'test-key');

    Http::fake([
        'https://api.groq.com/openai/v1/chat/completions' => Http::response([
            'choices' => [[
                'message' => [
                    'content' => null,
                    'tool_calls' => [[
                        'function' => [
                            'name' => 'navigateTo',
                            'arguments' => '{"path":"/profile"}',
                        ],
                    ]],
                ],
            ]],
        ], 200),
    ]);

    $this->postJson(route('api.ai.operator.chat'), [
        'message' => 'Open my profile page',
    ])
        ->assertOk()
        ->assertJsonPath('tool_calls.0.function.name', 'navigateTo')
        ->assertJsonPath('tool_calls.0.function.arguments', '{"path":"/profile"}');
});
