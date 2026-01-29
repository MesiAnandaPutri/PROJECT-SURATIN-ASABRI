<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disposisi extends Model
{
    use HasFactory;
    protected $table = 'disposisi';
    protected $guarded = ['id'];
    protected $casts = [
        'diteruskan_kepada' => 'array',
    ];

    public function suratMasuk()
    {
        return $this->belongsTo(SuratMasuk::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class); // sender
    }
}
