<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $notifications = Notification::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('role', strtolower($user->role))
                ->orWhere('role', ucfirst($user->role)); // Check both cases just to be safe
        })
            ->latest()
            ->take(20)
            ->get();

        return response()->json($notifications);
    }

    public function unreadCount()
    {
        $user = Auth::user();

        $count = Notification::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('role', strtolower($user->role))
                ->orWhere('role', ucfirst($user->role));
        })
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        // Basic authorization check: ensure the notification belongs to the user or their role
        $user = Auth::user();
        if ($notification->user_id !== $user->id && $notification->role !== $user->role) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllRead()
    {
        $user = Auth::user();

        Notification::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('role', $user->role);
        })
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
