<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user exists by google_id
            $user = User::where('google_id', $googleUser->getId())->first();
            
            // If not found by google_id, check by email
            if (!$user) {
                $user = User::where('email', $googleUser->getEmail())->first();
                
                if ($user) {
                    // Update existing user with Google info
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                } else {
                    // Create a new user
                    $user = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'password' => Hash::make(Str::random(24)),
                        'email_verified_at' => now(),
                    ]);
                }
            }
            
            // Login the user
            Auth::login($user);
            
            // Redirect to dashboard
            return redirect()->route('dashboard');
            
        } catch (\Exception $e) {
            // Handle errors
            return redirect()->route('login')->with('error', 'Google authentication failed. Please try again.');
        }
    }
}