<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ChatMessage;

class ChatMessageSeeder extends Seeder
{
    public function run(): void
    {
        ChatMessage::factory(20)->create();
    }
}
