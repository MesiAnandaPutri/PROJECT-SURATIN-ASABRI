<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuratKeluar extends Model
{
    use HasFactory;
    protected $table = 'surat_keluar';
    protected $guarded = ['id'];
    protected $fillable = [
        'tujuan',
        'kategori_berkas',
        'no_surat',
        'status',
        'perihal',
        'tingkat_urgensi_penyelesaian',
        'klasifikasi_surat_dinas',
        'keterangan',
        'file_path',
        'tanggal_pembuatan',
        'no_resi',
        'user_id',
        'created_by_name',
        'file_resi'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
