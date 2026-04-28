<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteKnowledge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use JsonException;
use Throwable;

class AiController extends Controller
{
    /**
     * @var array<int, string>
     */
    private const array NAVIGABLE_PATHS = [
        '/user/dashboard',
        '/user/transfer',
        '/profile',
        '/notification',
    ];

    /**
     * @throws JsonException
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $faq = SiteKnowledge::query()
            ->select(['id', 'content'])
            ->similarTo($validated['message'], minSimilarity: 0.3)
            ->first();

        $knowledgeContext = $faq ? 'Relevant site information: '.$faq->content : 'No specific site information found.';

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
                            'content' => "You are a helpful banking site assistant. Answer briefly and conversationally.\n".
                              "IMPORTANT RULES:\n".
                              "1. NEVER output XML tags, HTML tags, `<function>`, or `<navigateTo>` in your text response. NEVER leak raw JSON.\n".
                              "2. ONLY use the official `tool_calls` API feature if the user EXPLICITLY asks to 'open', 'go to', or 'navigate' to a page. \n".
                              "3. If the user is just asking a question (e.g., 'how do I transfer?'), DO NOT navigate. Just answer the question using the knowledge provided below.\n\n".
                              "Knowledge:\n".$knowledgeContext,
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
                                'description' => "ONLY use this tool when the user explicitly requests to 'open', 'go to', or 'navigate' to a specific page.",
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
        } catch (Throwable $exception) {
            Log::error('Groq proxy request failed.', [
                'exception' => $exception,
            ]);

            return response()->json([
                'message' => 'Unable to process AI request right now.',
            ], 502);
        }

        $assistantMessage = data_get($groqResponse->json(), 'choices.0.message', []);
        $content = data_get($assistantMessage, 'content');
        $toolCalls = data_get($assistantMessage, 'tool_calls', []);

        if ($this->hasNoToolCalls($toolCalls)) {
            $fallbackToolCall = $this->extractNavigateToolCallFromContent($content);

            if ($fallbackToolCall !== null) {
                $toolCalls = [$fallbackToolCall];
                $content = null;
            }
        }

        return response()->json([
            'message' => $content,
            'tool_calls' => $toolCalls,
        ]);
    }

    private function hasNoToolCalls(mixed $toolCalls): bool
    {
        return ! is_array($toolCalls) || $toolCalls === [];
    }

    /**
     * @return array<string, mixed>|null
     *
     * @throws JsonException
     */
    private function extractNavigateToolCallFromContent(mixed $content): ?array
    {
        if (! is_string($content)) {
            return null;
        }

        $path = null;

        if (preg_match('/<?navigateTo[^>]*path=["\']([^"\']+)["\'][^>]*>/i', $content, $attrMatches)) {
            $path = $attrMatches[1];
        } elseif (preg_match('/<?navigateTo[\s>]*(\{.*?})/i', $content, $jsonMatches)) {
            $arguments = json_decode($jsonMatches[1], true);
            $path = is_array($arguments) ? ($arguments['path'] ?? null) : null;
        }

        if (! is_string($path) || ! in_array($path, self::NAVIGABLE_PATHS, true)) {
            return null;
        }

        return [
            'type' => 'function',
            'function' => [
                'name' => 'navigateTo',
                'arguments' => json_encode(['path' => $path], JSON_THROW_ON_ERROR),
            ],
        ];
    }
}
