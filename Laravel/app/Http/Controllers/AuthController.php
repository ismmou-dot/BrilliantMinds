<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'in:student,teacher'],
            'phone' => ['nullable', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required','in:male,female'],
        ]);

        $fields['password'] = Hash::make($fields['password']); // Ensure password is hashed
        $user = User::create($fields);
        $token = $user->createToken($request->name);

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ], 201); // Use 201 Created for successful registration
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken($user->name);

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'You are logged out.',
        ], 200);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255',
            'role' => 'string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'avatar' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg',
            'date_of_birth' => 'date',
            'gender' => 'string|max:10',
        ]);

        $user = auth()->user();

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $avatarUrl = asset('storage/' . $path);
            $user->avatar = $avatarUrl;
            Log::debug('Avatar uploaded: ' . $avatarUrl);
        }

        $user->update($request->except('avatar'));

        if ($request->has('avatar')) {
            $user->save();
        }

        Log::debug('User updated: ', $user->toArray());
        return response()->json($user);
    }
    
    public function index(Request $request)
    {
        $user = auth()->user();
        Log::debug('Fetching user data: ', $user->toArray());
        return response()->json($user);
    }
}
