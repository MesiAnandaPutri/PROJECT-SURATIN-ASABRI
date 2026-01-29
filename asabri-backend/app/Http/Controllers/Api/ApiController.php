<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ApiController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('asabri-token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }

    // --- SURAT MASUK CRUD ---

    public function getSuratMasuk()
    {
        return response()->json(SuratMasuk::all());
    }

    public function showSuratMasuk($id)
    {
        $surat = SuratMasuk::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        return response()->json($surat);
    }

    public function storeSuratMasuk(Request $request)
    {
        $surat = SuratMasuk::create($request->all());
        return response()->json($surat, 201);
    }

    public function updateSuratMasuk(Request $request, $id)
    {
        $surat = SuratMasuk::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        $surat->update($request->all());
        return response()->json($surat);
    }

    public function destroySuratMasuk($id)
    {
        $surat = SuratMasuk::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        $surat->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    // --- SURAT KELUAR CRUD ---

    public function getSuratKeluar()
    {
        return response()->json(SuratKeluar::all());
    }

    public function showSuratKeluar($id)
    {
        $surat = SuratKeluar::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        return response()->json($surat);
    }

    public function storeSuratKeluar(Request $request)
    {
        $surat = SuratKeluar::create($request->all());
        return response()->json($surat, 201);
    }

    public function updateSuratKeluar(Request $request, $id)
    {
        $surat = SuratKeluar::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        $surat->update($request->all());
        return response()->json($surat);
    }

    public function destroySuratKeluar($id)
    {
        $surat = SuratKeluar::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        $surat->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
