<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء 10 مستخدمين مع رسائل
        \App\Models\User::factory(10)->create()->each(function ($user) {
            \App\Models\ChatMessage::factory(2)->create(['user_id' => $user->id]);
        });
        // مستخدم تجريبي ثابت
        $user = \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        \App\Models\ChatMessage::factory(3)->create(['user_id' => $user->id]);
    }
}
