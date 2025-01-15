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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('classroom_id'); // Clé étrangère pour lier un quiz à une classroom
            $table->string('title'); // Titre du quiz
            $table->text('description')->nullable(); // Description optionnelle
            $table->integer('duration')->nullable(); // Durée en minutes
            $table->dateTime('start_time')->nullable(); // Date/heure de début
            $table->dateTime('end_time')->nullable(); // Date/heure de fin
            $table->timestamps();
    
            // Définir la clé étrangère
            $table->foreign('classroom_id')
                  ->references('id')
                  ->on('classrooms')
                  ->onDelete('cascade'); // Supprimer les quizzes si la classroom est supprimée
    
            // Ajouter un index sur classroom_id
            $table->index('classroom_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
