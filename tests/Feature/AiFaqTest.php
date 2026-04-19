<?php

use App\Models\SiteKnowledge;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('ai chat answers from the faq table before calling groq', function () {
    $userId = DB::table('users')->insertGetId([
        'email' => 'faq-user@example.com',
        'password' => 'not-used-for-this-test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $user = User::query()->findOrFail($userId);
    $this->actingAs($user);

    SiteKnowledge::create([
        'content' => 'To change your password, click on your profile settings and select the password change option in the account security section.',
    ]);

    $response = $this->postJson(route('api.ai.operator.chat'), [
        'message' => 'How do I change password?',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('source', 'faq')
        ->assertJsonPath('message', 'To change your password, click on your profile settings and select the password change option in the account security section.');
});
