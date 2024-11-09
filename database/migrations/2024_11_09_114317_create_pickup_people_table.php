<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pickup_people', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('relation', ['Father', 'Mother', 'Brother', 'Sister', 'Grandfather', 'Grandmother']);
            $table->string('contact_number', 10);
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pickup_people');
    }
};
