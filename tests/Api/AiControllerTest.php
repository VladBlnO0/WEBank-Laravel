<?php

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

uses(TestCase::class);

test('ai operator chat endpoint validates message', function () {
    $this->withoutMiddleware();

    $this->postJson('/api/ai/operator/chat', [
        'message' => '',
    ])->assertUnprocessable();
});

test('ai operator chat endpoint returns parsed ai response', function () {
    $this->withoutMiddleware();
    config()->set('services.groq.key', 'test-key');

    Http::fake([
        'https://api.groq.com/openai/v1/chat/completions' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => 'Sure, moving now.',
                        'tool_calls' => [
                            [
                                'function' => [
                                    'name' => 'navigateTo',
                                    'arguments' => '{"path":"/profile"}',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ], 200),
    ]);

    $this->postJson('/api/ai/operator/chat', [
        'message' => 'Go to profile',
    ])
        ->assertOk()
        ->assertJsonPath('message', 'Sure, moving now.')
        ->assertJsonPath('tool_calls.0.function.name', 'navigateTo');

    Http::assertSent(function (Request $request): bool {
        return $request->url() === 'https://api.groq.com/openai/v1/chat/completions'
            && $request->hasHeader('Authorization', 'Bearer test-key');
    });
});

test('ai operator chat endpoint returns 502 when upstream fails', function () {
    $this->withoutMiddleware();
    config()->set('services.groq.key', 'test-key');

    Http::fake([
        'https://api.groq.com/openai/v1/chat/completions' => Http::response([
            'error' => 'bad gateway',
        ], 500),
    ]);

    $this->postJson('/api/ai/operator/chat', [
        'message' => 'Hello',
    ])
        ->assertStatus(502)
        ->assertJsonPath('message', 'Unable to process AI request right now.');
});
