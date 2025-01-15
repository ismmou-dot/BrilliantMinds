<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['discussion_id', 'content', 'user_id'];

    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function files()
    {
        return $this->morphMany(File::class, 'fileable');
    }
    public function links()
    {
        return $this->hasMany(Link::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
