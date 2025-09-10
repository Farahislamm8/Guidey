<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
	// Register new user
	public function register(Request $request)
	{
		$request->validate([
			'name' => 'required|string|max:255',
			'email' => 'required|string|email|max:255|unique:users',
			'password' => 'required|string|min:6',
		]);

		$user = User::create([
			'name' => $request->name,
			'email' => $request->email,
			'password' => Hash::make($request->password),
		]);

		return response()->json(['user' => $user], 201);
	}

	// Login user
	public function login(Request $request)
	{
		$request->validate([
			'email' => 'required|email',
			'password' => 'required',
		]);

		$user = User::where('email', $request->email)->first();

		if ($user && Hash::check($request->password, $user->password)) {
			Auth::login($user);
			return response()->json(['user' => $user], 200);
		} else {
			return response()->json(['error' => 'Invalid credentials'], 401);
		}
	}
}
