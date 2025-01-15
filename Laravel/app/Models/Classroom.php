<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description','background', 'code', 'teacher_id'];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($classroom) {
            // Automatically create a discussion for this classroom
            $classroom->discussion()->create([
                'title' => 'General Discussion',
                'created_by' => $classroom->teacher_id, // Set the teacher as the creator
            ]);
        });
    }

    public function discussion()
    {
        return $this->hasOne(Discussion::class);
    }
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
    public function students()
    {
        return $this->belongsToMany(User::class, 'classroom_student', 'classroom_id', 'student_id');
    }
    public function assignments()
    {
         return $this->hasMany(Assignment::class);
    }
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}

