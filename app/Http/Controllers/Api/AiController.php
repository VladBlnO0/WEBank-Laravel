<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $apiKey = config('services.groq.key');

        if (! $apiKey) {
            return response()->json([
                'message' => 'Groq is not configured on the server.',
            ], 500);
        }

        try {
            $groqResponse = Http::withToken($apiKey)
                ->acceptJson()
                ->timeout(20)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.1-8b-instant',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a banking site operator assistant. Answer briefly. If the user asks to open/navigate to a page, you must call the navigateTo tool with one allowed internal path. Allowed paths: /user/dashboard, /user/transfer, /profile, /notification.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $validated['message'],
                        ],
                    ],
                    'tools' => [
                        [
                            'type' => 'function',
                            'function' => [
                                'name' => 'navigateTo',
                                'description' => 'Navigates the user to a specific page on the website.',
                                'parameters' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'path' => [
                                            'type' => 'string',
                                            'enum' => ['/user/dashboard', '/user/transfer', '/profile', '/notification'],
                                            'description' => 'The internal URL path to redirect to.',
                                        ],
                                    ],
                                    'required' => ['path'],
                                ],
                            ],
                        ],
                    ],
                    'tool_choice' => 'auto',
                ])
                ->throw();
        } catch (\Throwable $exception) {
            Log::error('Groq proxy request failed.', [
                'exception' => $exception,
            ]);

            return response()->json([
                'message' => 'Unable to process AI request right now.',
            ], 502);
        }

        $assistantMessage = data_get($groqResponse->json(), 'choices.0.message', []);

        return response()->json([
            'message' => data_get($assistantMessage, 'content'),
            'tool_calls' => data_get($assistantMessage, 'tool_calls', []),
        ]);
    }
}
