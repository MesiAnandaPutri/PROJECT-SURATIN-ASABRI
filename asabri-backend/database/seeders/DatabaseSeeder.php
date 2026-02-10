<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // 1. Create Users
        User::create([
            'nama_lengkap' => 'Administrator',
            'username' => 'admin123',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        User::create([
            'nama_lengkap' => 'Staf Tata Usaha',
            'username' => 'staff01',
            'password' => Hash::make('password'),
            'role' => 'staff'
        ]);

        User::create([
            'nama_lengkap' => 'Kepala Divisi',
            'username' => 'pimpinan01',
            'password' => Hash::make('password'),
            'role' => 'pimpinan'
        ]);

        User::create([
            'nama_lengkap' => 'ASABRI User',
            'username' => 'asabri1971@mail.co.id',
            'password' => Hash::make('asabri1971'),
            'role' => 'admin'
        ]);

        $this->call(DummyDataSeeder::class);
    }
}
