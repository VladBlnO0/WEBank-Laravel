<?php

use App\Models\SiteKnowledge;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

$faqContent = 'To change your password, click on your profile settings and select the password change option in the account security section.';

test('ai chat sends faq context to groq', function () use ($faqContent) {
    $userId = DB::table('users')->insertGetId([
        'email' => 'faq-user@example.com',
        'password' => 'not-used-for-this-test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $user = User::query()->findOrFail($userId);
    $this->actingAs($user);

    SiteKnowledge::create([
        'content' => $faqContent,
    ]);

    Http::fake([
        'api.groq.com/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => 'Use your profile settings to change your password.',
                    ],
                ],
            ],
        ]),
    ]);

    $response = $this->postJson(route('api.ai.operator.chat'), [
        'message' => 'How do I change password?',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Use your profile settings to change your password.')
        ->assertJsonPath('tool_calls', []);

    Http::assertSent(function ($request) use ($faqContent) {
        return str_contains($request->body(), $faqContent);
    });
});
