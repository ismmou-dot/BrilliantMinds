<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'assignment_id',
        'student_id',
        'comments',
        'submitted_at',
    ];

    // Relation avec Assignment
    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    // Relation avec Student
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Polymorphic relation with File
    public function files()
    {
        return $this->morphMany(File::class, 'fileable');
    }
}
