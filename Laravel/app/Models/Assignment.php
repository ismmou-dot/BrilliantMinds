<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'classroom_id',
        'title',
        'instructions',
        'points',
        'dueDateTime',
    ];
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
    public function submissions()
    {
    return $this->hasMany(Submission::class);
    }
    public function files()
    {   
    return $this->morphMany(File::class, 'fileable');
    }

}
