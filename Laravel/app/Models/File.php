<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = ['fileable_id', 'fileable_type', 'name', 'file_path', 'type', 'icon', 'size', 'uploaded_by'];

    public function fileable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
