<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'student_id',
        'answers',
        'score',
        'submitted_at',
    ];

    protected $casts = [
        'answers' => 'array', // Automatically decode/encode JSON
        'submitted_at' => 'datetime',
    ];

    /**
     * Relation avec le quiz.
     */
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Relation avec l'étudiant.
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
