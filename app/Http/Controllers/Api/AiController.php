<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteKnowledge;
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

    $faq = SiteKnowledge::query()
      ->select(['id', 'content'])
      ->similarTo($validated['message'], minSimilarity: 0.3)
      ->first();

    $knowledgeContext = $faq ? "Relevant site information: " . $faq->content : "No specific site information found.";

    $apiKey = config('services.groq.key');

    if (!$apiKey) {
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
              'content' => "You are a helpful banking site assistant. Answer briefly and conversationally.\n" .
                "IMPORTANT RULES:\n" .
                "1. Never output raw JSON or tool names in your text response.\n" .
                "2. ONLY call the `navigateTo` tool if the user EXPLICITLY asks to 'open', 'go to', or 'navigate' to a page. \n" .
                "3. If the user is just asking a question (e.g., 'how do I change my email?'), DO NOT use the tool. Just answer their question using the knowledge provided below.\n\n" .
                "Knowledge:\n" . $knowledgeContext,
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
                'description' => 'ONLY use this tool when the user explicitly requests to open, go to, or navigate to a specific page.',
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
