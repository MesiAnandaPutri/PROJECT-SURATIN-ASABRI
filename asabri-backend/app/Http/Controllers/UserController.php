<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class UserController extends Controller
{
    public function getUsers()
    {
        try {
            // Return all users with basic info
            $usersRaw = User::all();
            \Illuminate\Support\Facades\Log::info('getUsers Raw:', ['count' => $usersRaw->count(), 'data' => $usersRaw->toArray()]);

            // Ensure role and status have compatible case for frontend if needed
            $users = $usersRaw->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->nama_lengkap ?? 'No Name',
                    'username' => $user->username ?? 'no-username',
                    'role' => ucfirst($user->role ?? 'staff'),
                    'status' => ucfirst($user->status ?? 'aktif'),
                    'ttd_path' => $user->ttd_path ? asset('storage/' . $user->ttd_path) : null,
                ];
            });

            \Illuminate\Support\Facades\Log::info('getUsers Mapped:', ['data' => $users->toArray()]);
            return response()->json($users);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error in getUsers: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching users', 'error' => $e->getMessage()], 500);
        }
    }

    public function storeUser(Request $request)
    {
        if (strtolower(Auth::user()->role) !== 'admin') {
            abort(403, 'Unauthorized. Only Admin can manage users.');
        }

        \Illuminate\Support\Facades\Log::info('storeUser Request:', [
            'all' => $request->all(),
            'has_file' => $request->hasFile('ttd_file'),
            'role' => $request->input('role'),
        ]);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|unique:users,username|max:255',
                'password' => 'required|string|min:6',
                'role' => 'required|string|in:admin,staff,pimpinan',
                'ttd_file' => 'nullable|file|mimes:jpg,jpeg,png|max:2048', // 2MB max
            ]);

            $userData = [
                'nama_lengkap' => $validated['name'],
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'aktif',
            ];

            // Upload TTD if role is pimpinan and file present
            if ($validated['role'] === 'pimpinan' && $request->hasFile('ttd_file')) {
                $file = $request->file('ttd_file');
                $filename = 'ttd_' . time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('ttd', $filename, 'public');
                $userData['ttd_path'] = $path;
            }

            $user = User::create($userData);

            return response()->json($user, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal membuat user', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroyUser($id)
    {
        if (strtolower(Auth::user()->role) !== 'admin') {
            abort(403, 'Unauthorized. Only Admin can manage users.');
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Prevent deleting the currently logged-in user if necessary
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete currently logged in user'], 403);
        }

        // Delete TTD file if exists
        if ($user->ttd_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->ttd_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->ttd_path);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function showUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->nama_lengkap,
            'username' => $user->username,
            'role' => $user->role,
            'status' => $user->status ?? 'aktif',
            'ttd_path' => $user->ttd_path ? asset('storage/' . $user->ttd_path) : null,
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        if (strtolower(Auth::user()->role) !== 'admin') {
            abort(403, 'Unauthorized. Only Admin can manage users.');
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users,username,' . $id,
                'role' => 'required|string|in:admin,staff,pimpinan',
                'password' => 'nullable|string|min:6',
                'status' => 'nullable|string|in:aktif,nonaktif,Aktif,Nonaktif',
                'ttd_file' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            ]);

            $user->nama_lengkap = $validated['name'];
            $user->username = $validated['username'];
            $user->role = $validated['role'];

            if (isset($validated['status'])) {
                $user->status = strtolower($validated['status']);
            }

            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            // Handle TTD Update
            if ($validated['role'] === 'pimpinan' && $request->hasFile('ttd_file')) {
                // Delete old TTD
                if ($user->ttd_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->ttd_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($user->ttd_path);
                }

                $file = $request->file('ttd_file');
                $filename = 'ttd_' . time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('ttd', $filename, 'public');
                $user->ttd_path = $path;
            } elseif ($validated['role'] !== 'pimpinan' && $user->ttd_path) {
                // If role changed from pimpinan to something else, remove TTD
                // Delete old TTD
                if ($user->ttd_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->ttd_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($user->ttd_path);
                }
                $user->ttd_path = null;
            }

            $user->save();

            return response()->json([
                'id' => $user->id,
                'name' => $user->nama_lengkap,
                'username' => $user->username,
                'role' => $user->role,
                'status' => $user->status,
                'ttd_path' => $user->ttd_path ? asset('storage/' . $user->ttd_path) : null,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memperbarui user', 'error' => $e->getMessage()], 500);
        }
    }
}
