<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'quiz_id',
        'text',
        'type',
        'options',
        'correct_answer',
        'points',
    ];

    protected $casts = [
        'options' => 'array', // Cast JSON en tableau PHP
    ];
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
