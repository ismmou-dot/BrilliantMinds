<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quiz_id'); // Clé étrangère pour associer la question à un quiz
            $table->string('text'); // Texte de la question
            $table->enum('type', ['multiple_choice', 'true_false', 'short_answer']); // Type de question
            $table->json('options')->nullable(); // Options pour les choix multiples
            $table->string('correct_answer')->nullable(); // Réponse correcte
            $table->integer('points'); // Points attribués pour la question
            $table->timestamps();
    
            // Définir la clé étrangère
            $table->foreign('quiz_id')
                  ->references('id')
                  ->on('quizzes')
                  ->onDelete('cascade'); // Supprimer les questions si le quiz est supprimé
    
            // Ajouter un index sur quiz_id
            $table->index('quiz_id');
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
