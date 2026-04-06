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
    Schema::create('meetings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('organizer_id')
              ->constrained('users')
              ->cascadeOnDelete();
        $table->string('title');
        $table->text('description')->nullable();
        $table->dateTime('start_at');
        $table->unsignedInteger('duration_minutes');
        $table->string('location')->nullable();
        $table->unsignedInteger('reminder_minutes')->default(15);
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('meetings');
    }
};
