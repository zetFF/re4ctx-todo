<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('todos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->date('due_date');
            $table->time('due_time');
            $table->boolean('reminder')->default(false);
            // $table->boolean('is_completed')->default(false);
            // $table->boolean('is_archived')->default(false);
            // $table->boolean('is_favorite')->default(false);
            $table->string('status')->default('in_progress');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('todos');
    }
};
