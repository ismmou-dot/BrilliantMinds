<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        $user = $request->user(); // Get the authenticated user using Sanctum

        // Check if the user is authenticated and has the required role
        if (!$user || $user->role !== $role) {
            return response()->json([
                'message' => 'Unauthorized: Access denied for this role.'
            ], 403); // Return a 403 Forbidden response for unauthorized access
        }

        return $next($request);
    }
}
