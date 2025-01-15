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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained()->onDelete('cascade'); // Relation avec Assignments
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade'); // Relation avec Students (table Users si polymorphisme)
            $table->text('comments')->nullable(); // Commentaires de l'étudiant
            $table->timestamp('submitted_at')->nullable(); // Date et heure de soumission
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
