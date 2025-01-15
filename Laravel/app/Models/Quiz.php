<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'classroom_id',
        'title',
        'description',
        'duration',
        'start_time',
        'end_time',
    ];

    /**
     * Relation avec Classroom.
     */
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    /**
     * Relation avec les questions (hypothèse).
     */
    public function questions()
    {
        return $this->hasMany(Question::class); // Si vous avez un modèle Question
    }
    public function submissions()
{
    return $this->hasMany(QuizSubmission::class);
}

}
