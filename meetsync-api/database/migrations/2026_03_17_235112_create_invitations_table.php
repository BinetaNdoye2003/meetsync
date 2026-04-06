<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
  public function up(): void
{
    Schema::create('invitations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('meeting_id')
              ->constrained()
              ->cascadeOnDelete();
        $table->foreignId('user_id')
              ->constrained()
              ->cascadeOnDelete();
        $table->enum('status', [
            'pending', 'accepted', 'refused'
        ])->default('pending');
        $table->timestamp('responded_at')->nullable();
        $table->timestamps();
        // Un user ne peut être invité qu'une fois par réunion
        $table->unique(['meeting_id', 'user_id']);
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invitations');
    }
};
