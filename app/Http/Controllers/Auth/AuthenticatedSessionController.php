<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Notifications\LoginCodeNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->ensureIsNotRateLimited();

        $user = User::query()
            ->where('email', Str::lower($request->string('email')->toString()))
            ->first();

        if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
            RateLimiter::hit($request->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($request->throttleKey());

        $code = $this->generateLoginCode();

        $request->session()->put([
            'login.challenge.user_id' => $user->id,
            'login.challenge.code_hash' => Hash::make($code),
            'login.challenge.remember' => $request->boolean('remember'),
            'login.challenge.expires_at' => now()->addMinutes(10)->timestamp,
        ]);

        $request->session()->regenerate();

        $user->notify(new LoginCodeNotification($code));

        return redirect()
            ->route('login.challenge')
            ->with('status', 'We sent a login code to your email address.');
    }

    /**
     * Show the login code challenge view.
     */
    public function createChallenge(Request $request): Response|RedirectResponse
    {
        if (! $this->hasPendingLoginChallenge($request)) {
            return redirect()->route('login');
        }

        return Inertia::render('auth/two-factor-challenge', [
            'status' => session('status'),
        ]);
    }

    /**
     * Confirm the login code and authenticate the user.
     */
    public function storeChallenge(Request $request): RedirectResponse
    {
        if (! $this->hasPendingLoginChallenge($request)) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        if ($this->challengeExpired($request)) {
            $this->forgetLoginChallenge($request);

            return redirect()
                ->route('login')
                ->with('status', 'Your login code expired. Please sign in again.');
        }

        if (! Hash::check($validated['code'], $request->session()->get('login.challenge.code_hash'))) {
            throw ValidationException::withMessages([
                'code' => 'The provided login code is invalid.',
            ]);
        }

        $userId = $request->session()->pull('login.challenge.user_id');
        $remember = (bool) $request->session()->pull('login.challenge.remember', false);
        $this->forgetLoginChallenge($request);

        $user = User::query()->findOrFail($userId);

        Auth::guard('web')->login($user, $remember);

        $request->session()->regenerate();

        return redirect()->intended(route('user.dashboard.index', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function generateLoginCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    private function hasPendingLoginChallenge(Request $request): bool
    {
        return $request->session()->has('login.challenge.user_id')
            && $request->session()->has('login.challenge.code_hash')
            && $request->session()->has('login.challenge.expires_at');
    }

    private function challengeExpired(Request $request): bool
    {
        return (int) $request->session()->get('login.challenge.expires_at') < now()->timestamp;
    }

    private function forgetLoginChallenge(Request $request): void
    {
        $request->session()->forget([
            'login.challenge.user_id',
            'login.challenge.code_hash',
            'login.challenge.remember',
            'login.challenge.expires_at',
        ]);
    }
}
