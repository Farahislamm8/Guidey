<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    public function index()
    {
        return ChatMessage::with('user')->get();
    }

    public function store(Request $request)
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $validated = $request->validate([
            'message' => 'required|string',
        ]);
        $chatMessage = ChatMessage::create([
            'user_id' => $userId,
            'message' => $validated['message'],
        ]);
        return response()->json($chatMessage, 201);
    }

    public function show($id)
    {
        return ChatMessage::with('user')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $chatMessage = ChatMessage::findOrFail($id);
        // تحقق أن المستخدم الحالي هو صاحب الرسالة
        if ($userId !== $chatMessage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'message' => 'required|string',
        ]);
        $chatMessage->update($validated);
        return response()->json($chatMessage);
    }

    public function destroy($id)
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $chatMessage = ChatMessage::findOrFail($id);
        // تحقق أن المستخدم الحالي هو صاحب الرسالة
        if ($userId !== $chatMessage->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $chatMessage->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
