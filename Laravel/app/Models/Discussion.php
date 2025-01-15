<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;

    protected $fillable = ['classroom_id', 'title', 'created_by'];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    
}
