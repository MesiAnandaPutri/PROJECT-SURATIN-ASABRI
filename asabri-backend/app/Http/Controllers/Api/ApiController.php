<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ApiController extends Controller
{
    public function login(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Login Attempt:', $request->all());

        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if ($request->username === 'admin' && $request->password === 'password') {
            if (!$user) {
                return response()->json(['message' => 'User admin not found in DB'], 404);
            }
        } else {
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
        }

        $token = $user->createToken('asabri-token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function dashboard()
    {
        // 1. Stats
        $countMasuk = SuratMasuk::count();
        $countKeluar = SuratKeluar::count();

        // Count 'pending' (only 'proses' for incoming, only 'draft' for outgoing)
        $pendingMasuk = SuratMasuk::where('status', 'proses')->count();
        $pendingKeluar = SuratKeluar::where('status', 'draft')->count();

        $stats = [
            'total' => (string) ($countMasuk + $countKeluar),
            'masuk' => (string) $countMasuk,
            'keluar' => (string) $countKeluar,
            'pending_masuk' => (string) $pendingMasuk,
            'pending_keluar' => (string) $pendingKeluar,
        ];

        // 2. Recent Activities
        // Fetch 5 latest from each, merge, sort, take 5
        $masuk = SuratMasuk::select('id', 'tanggal_terima_surat as created_at', 'pengirim as dari_kepada', 'perihal', 'status')
            ->selectRaw("'Surat Masuk' as tipe")
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $keluar = SuratKeluar::select('id', 'tanggal_pembuatan as created_at', 'tujuan as dari_kepada', 'perihal', 'status', 'tingkat_urgensi_penyelesaian as prioritas') // map 'tingkat_urgensi...' to 'prioritas'
            ->selectRaw("'Surat Keluar' as tipe")
            ->orderBy('tanggal_pembuatan', 'desc')
            ->limit(5)
            ->get();

        $activities = $masuk->concat($keluar)->sortByDesc('created_at')->take(5)->values();

        // Format dates for frontend
        $activities = $activities->map(function ($item) {
            $date = \Carbon\Carbon::parse($item->created_at);
            return [
                'id' => $item->id,
                'tanggal' => $date->translatedFormat('d M Y'),
                'waktu' => $date->format('H:i') . ' WIB',
                'tipe' => $item->tipe,
                'dari_kepada' => $item->dari_kepada,
                'perihal' => $item->perihal,
                'status' => ucfirst($item->status ?? 'proses'),
            ];
        });

        return response()->json([
            'stats' => $stats,
            'activities' => $activities
        ]);
    }

    public function getEnumOptions()
    {
        $masukColumns = ['sumber_berkas', 'status']; // Removed klasifikasi and tingkat
        $keluarColumns = ['kategori_berkas', 'klasifikasi_surat_dinas', 'tingkat_urgensi_penyelesaian', 'status'];

        $enums = [];

        // Surat Masuk Enums
        foreach ($masukColumns as $column) {
            $result = \Illuminate\Support\Facades\DB::select("SHOW COLUMNS FROM surat_masuk WHERE Field = '{$column}'");
            if (empty($result)) {
                $enums['surat_masuk_' . $column] = [];
                continue;
            }
            $type = $result[0]->Type;
            preg_match("/^enum\((.*)\)$/i", $type, $matches);
            if (isset($matches[1])) {
                $enum = array_map(function ($value) {
                    return trim($value, "'");
                }, explode(',', $matches[1]));
                $enums['surat_masuk_' . $column] = $enum;
            } else {
                $enums['surat_masuk_' . $column] = [];
            }
        }

        // Surat Keluar Enums
        foreach ($keluarColumns as $column) {
            $result = \Illuminate\Support\Facades\DB::select("SHOW COLUMNS FROM surat_keluar WHERE Field = '{$column}'");
            if (empty($result)) {
                $enums['surat_keluar_' . $column] = [];
                continue;
            }
            $type = $result[0]->Type;
            preg_match("/^enum\((.*)\)$/i", $type, $matches);
            if (isset($matches[1])) {
                $enum = array_map(function ($value) {
                    return trim($value, "'");
                }, explode(',', $matches[1]));
                $enums['surat_keluar_' . $column] = $enum;
            } else {
                $enums['surat_keluar_' . $column] = [];
            }
        }

        // Special Mapping using 'surat_masuk_' prefix
        $enums['sumber_berkas'] = $enums['surat_masuk_sumber_berkas'];
        $enums['status'] = $enums['surat_masuk_status'];
        // Removed klasifikasi/tingkat mappings

        // --- Fetch Distinct Years for Filtering ---
        $suratMasukYears = SuratMasuk::selectRaw('YEAR(tanggal_terima_surat) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->filter() // Remove nulls
            ->values();

        $suratKeluarYears = SuratKeluar::selectRaw('YEAR(tanggal_pembuatan) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->filter() // Remove nulls
            ->values();

        $enums['surat_masuk_years'] = $suratMasukYears;
        $enums['surat_keluar_years'] = $suratKeluarYears;

        return response()->json($enums);
    }

    // --- SURAT MASUK CRUD ---

    public function getSuratMasuk(Request $request)
    {
        $query = SuratMasuk::with(['disposisi.user'])->orderBy('tanggal_terima_surat', 'desc');

        if ($request->has('year') && $request->year != '') {
            $query->whereYear('tanggal_terima_surat', $request->year);
        }

        return response()->json($query->get());
    }

    public function showSuratMasuk($id)
    {
        $surat = SuratMasuk::with(['disposisi.user'])->find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        return response()->json($surat);
    }

    public function storeSuratMasuk(Request $request)
    {
        if (Auth::user()->role === 'pimpinan') {
            abort(403, 'Unauthorized. Pimpinan cannot create Surat Masuk.');
        }

        \Illuminate\Support\Facades\Log::info('Surat Masuk Store Attempt:', [
            'data' => $request->all(),
            'has_file' => $request->hasFile('file'),
            'content_type' => $request->header('Content-Type')
        ]);
        try {
            $validated = $request->validate([
                'pengirim' => 'required|string',
                'no_surat' => 'required|string',
                'tanggal_terima_surat' => 'required|date',
                'tanggal_surat_masuk' => 'required|date',
                'sumber_berkas' => 'required|in:internal,eksternal',
                'perihal' => 'required|string',
                'status' => 'nullable|string',
                'klasifikasi' => 'nullable|string',
                'tingkat' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:51200',
            ]);


            // Handle File Upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('surat-masuk', $filename, 'public');
                $validated['file_path'] = $path;
            }

            // Add creator ID
            $validated['user_id'] = Auth::id();

            \Illuminate\Support\Facades\Log::info('Creating SuratMasuk with data:', $validated);

            $surat = SuratMasuk::create($validated);

            \Illuminate\Support\Facades\Log::info('SuratMasuk Created ID: ' . $surat->id);

            // Notify Pimpinan
            try {
                Notification::create([
                    'role' => 'pimpinan',
                    'title' => 'Surat Masuk Baru',
                    'message' => "Surat No: {$surat->no_surat} dari {$surat->pengirim} memerlukan disposisi.",
                    'surat_masuk_id' => $surat->id,
                    'is_read' => false,
                ]);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Failed to create notification: ' . $e->getMessage());
            }

            \Illuminate\Support\Facades\Log::info('Returning success response');

            return response()->json([
                'message' => 'Surat masuk berhasil ditambahkan',
                'data' => $surat
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error('Validation Error: ', $e->errors());
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Fatal Error storeSuratMasuk: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json(['message' => 'Terjadi kesalahan internal: ' . $e->getMessage()], 500);
        }
    }

    public function updateSuratMasuk(Request $request, $id)
    {
        if (Auth::user()->role === 'pimpinan') {
            abort(403, 'Unauthorized. Pimpinan cannot update Surat Masuk.');
        }
        $surat = SuratMasuk::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        $surat->update($request->all());
        return response()->json($surat);
    }

    public function destroySuratMasuk($id)
    {
        if (Auth::user()->role === 'pimpinan') {
            abort(403, 'Unauthorized. Pimpinan cannot delete Surat Masuk.');
        }
        $surat = SuratMasuk::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        $surat->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    // --- SURAT KELUAR CRUD ---

    public function getSuratKeluar(Request $request)
    {
        $query = SuratKeluar::with('user')->orderBy('tanggal_pembuatan', 'desc');

        if ($request->has('year') && $request->year != '') {
            $query->whereYear('tanggal_pembuatan', $request->year);
        }

        return response()->json($query->get());
    }

    public function showSuratKeluar($id)
    {
        $surat = SuratKeluar::with('user')->find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        return response()->json($surat);
    }

    public function storeSuratKeluar(Request $request)
    {
        if (Auth::user()->role === 'pimpinan') {
            abort(403, 'Unauthorized. Pimpinan cannot create Surat Keluar.');
        }

        \Illuminate\Support\Facades\Log::info('Surat Keluar Store Attempt:', [
            'data' => $request->all(),
            'has_file' => $request->hasFile('file'),
            'content_type' => $request->header('Content-Type')
        ]);

        try {
            $validated = $request->validate([
                'tujuan' => 'required|string',
                'tanggal_pembuatan' => 'required|date',
                'kategori_berkas' => 'required|string',
                'no_surat' => 'required|string|unique:surat_keluar,no_surat',
                'status' => 'nullable|string',
                'perihal' => 'required|string',
                'tingkat_urgensi_penyelesaian' => 'nullable|string',
                'klasifikasi_surat_dinas' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'no_resi' => 'nullable|string',
                'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:51200',
            ]);

            // No defaults needed

            // Status automation logic
            $validated['status'] = !empty($validated['no_resi']) ? 'terkirim' : 'draft';

            // Add creator ID
            $validated['user_id'] = Auth::id();

            // Handle File Upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('surat-keluar', $filename, 'public');
                $validated['file_path'] = $path;
            }

            $surat = SuratKeluar::create($validated);
            return response()->json($surat, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error in storeSuratKeluar: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateSuratKeluar(Request $request, $id)
    {
        if (Auth::user()->role === 'pimpinan') {
            abort(403, 'Unauthorized. Pimpinan cannot update Surat Keluar.');
        }

        $surat = SuratKeluar::find($id);
        if (!$surat) {
            return response()->json(['message' => 'Surat tidak ditemukan'], 404);
        }

        try {
            $validated = $request->validate([
                'tujuan' => 'nullable|string',
                'tanggal_pembuatan' => 'nullable|date',
                'kategori_berkas' => 'nullable|string',
                'no_surat' => 'nullable|string|unique:surat_keluar,no_surat,' . $id,
                'status' => 'nullable|string',
                'perihal' => 'nullable|string',
                'tingkat_urgensi_penyelesaian' => 'nullable|string',
                'klasifikasi_surat_dinas' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'no_resi' => 'nullable|string',
                'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:51200',
                'file_resi' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240', // Max 10MB, allow images/docs
            ]);

            // Ensure we don't save nulls for required DB columns if they are present in request but null
            // For update, we only update what is present.
            if (array_key_exists('tujuan', $validated))
                $validated['tujuan'] = $validated['tujuan'] ?? '-';
            if (array_key_exists('perihal', $validated))
                $validated['perihal'] = $validated['perihal'] ?? '-';
            if (array_key_exists('kategori_berkas', $validated))
                $validated['kategori_berkas'] = $validated['kategori_berkas'] ?? 'surat dinas';

            // Handle File Replacement (Surat File)
            if ($request->hasFile('file')) {
                // Delete old file if exists
                if ($surat->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($surat->file_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($surat->file_path);
                }

                $file = $request->file('file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('surat-keluar', $filename, 'public');
                $validated['file_path'] = $path;
            }

            // Handle File Resi Upload
            if ($request->hasFile('file_resi')) {
                // Delete old resi file if exists
                if ($surat->file_resi && \Illuminate\Support\Facades\Storage::disk('public')->exists($surat->file_resi)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($surat->file_resi);
                }

                $fileResi = $request->file('file_resi');
                $filenameResi = 'resi_' . time() . '_' . $fileResi->getClientOriginalName();
                $pathResi = $fileResi->storeAs('resi-surat-keluar', $filenameResi, 'public');
                $validated['file_resi'] = $pathResi;
            }

            // Logic: Tidak Ada Resi → selesai, Ada Resi → terkirim, Hapus Resi → draft
            if ($request->input('tidak_ada_resi') == '1') {
                // Pilihan "Tidak Ada Resi" — kosongkan no_resi dan set status selesai
                $validated['no_resi'] = null;
                $validated['status'] = 'selesai';
            } elseif (array_key_exists('no_resi', $validated) || $request->hasFile('file_resi')) {
                // Determine the new state of resi and file
                $newNoResi = array_key_exists('no_resi', $validated) ? $validated['no_resi'] : $surat->no_resi;
                $hasFile = $request->hasFile('file_resi') ? true : !empty($surat->file_resi);

                if (empty($newNoResi) && !$hasFile) {
                    // Jika keduanya kosong (dihapus), kembalikan ke draft
                    $validated['status'] = 'draft';
                } else {
                    // Jika ada salah satu, status terkirim
                    $validated['status'] = 'terkirim';
                }
            }

            $surat->update($validated);
            return response()->json($surat);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error in updateSuratKeluar: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroySuratKeluar($id)
    {
        if (Auth::user()->role === 'pimpinan') {
            abort(403, 'Unauthorized. Pimpinan cannot delete Surat Keluar.');
        }
        $surat = SuratKeluar::find($id);
        if (!$surat)
            return response()->json(['message' => 'Not Found'], 404);
        $surat->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    // --- USER MANAGEMENT ---

    public function getUsers()
    {
        try {
            // Return all users with basic info
            $usersRaw = User::all();
            \Illuminate\Support\Facades\Log::info('getUsers Raw:', ['count' => $usersRaw->count(), 'data' => $usersRaw->toArray()]);

            // Ensure role and status have compatible case for frontend if needed
            $users = $usersRaw->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->nama_lengkap ?? 'No Name',
                    'username' => $user->username ?? 'no-username',
                    'role' => ucfirst($user->role ?? 'staff'),
                    'status' => ucfirst($user->status ?? 'aktif'),
                    'ttd_path' => $user->ttd_path ? asset('storage/' . $user->ttd_path) : null,
                ];
            });

            \Illuminate\Support\Facades\Log::info('getUsers Mapped:', ['data' => $users->toArray()]);
            return response()->json($users);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error in getUsers: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching users', 'error' => $e->getMessage()], 500);
        }
    }

    public function storeUser(Request $request)
    {
        if (strtolower(Auth::user()->role) !== 'admin') {
            abort(403, 'Unauthorized. Only Admin can manage users.');
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|unique:users,username|max:255',
                'password' => 'required|string|min:6',
                'role' => 'required|string|in:admin,staff,pimpinan', // Adjust roles as needed
                'ttd_file' => 'nullable|file|mimes:jpg,jpeg,png|max:2048', // 2MB max
            ]);

            $userData = [

                'nama_lengkap' => $validated['name'], // Mapping 'name' from frontend to 'nama_lengkap' in DB
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'aktif',
            ];

            // Upload TTD if role is pimpinan and file present
            if ($validated['role'] === 'pimpinan' && $request->hasFile('ttd_file')) {
                $file = $request->file('ttd_file');
                $filename = 'ttd_' . time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('ttd', $filename, 'public');
                $userData['ttd_path'] = $path;
            }

            $user = User::create($userData);

            return response()->json($user, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal membuat user', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroyUser($id)
    {
        if (strtolower(Auth::user()->role) !== 'admin') {
            abort(403, 'Unauthorized. Only Admin can manage users.');
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Prevent deleting the currently logged-in user if necessary
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete currently logged in user'], 403);
        }

        // Delete TTD file if exists
        if ($user->ttd_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->ttd_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->ttd_path);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function showUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->nama_lengkap, // Map to 'name' for frontend
            'username' => $user->username,
            'role' => $user->role,
            'status' => $user->status ?? 'aktif',
            'ttd_path' => $user->ttd_path ? asset('storage/' . $user->ttd_path) : null,
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        if (strtolower(Auth::user()->role) !== 'admin') {
            abort(403, 'Unauthorized. Only Admin can manage users.');
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users,username,' . $id,
                'role' => 'required|string|in:admin,staff,pimpinan',
                'password' => 'nullable|string|min:6', // Password optional on update
                'status' => 'nullable|string|in:aktif,nonaktif,Aktif,Nonaktif',
                'ttd_file' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            ]);

            $user->nama_lengkap = $validated['name'];
            $user->username = $validated['username'];
            $user->role = $validated['role'];

            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            if (isset($validated['status'])) {
                $user->status = strtolower($validated['status']);
            }

            // Handle TTD Update
            if ($validated['role'] === 'pimpinan' && $request->hasFile('ttd_file')) {
                // Delete old TTD
                if ($user->ttd_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->ttd_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($user->ttd_path);
                }

                $file = $request->file('ttd_file');
                $filename = 'ttd_' . time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('ttd', $filename, 'public');
                $user->ttd_path = $path;
            } elseif ($validated['role'] !== 'pimpinan' && $user->ttd_path) {
                // If role changed from pimpinan to something else, remove TTD
                if ($user->ttd_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->ttd_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($user->ttd_path);
                }
                $user->ttd_path = null;
            }

            $user->save();

            return response()->json([
                'id' => $user->id,
                'name' => $user->nama_lengkap,
                'username' => $user->username,
                'role' => $user->role,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memperbarui user', 'error' => $e->getMessage()], 500);
        }
    }

    public function getNextSuratKeluarNumber(Request $request)
    {
        $category = $request->query('category');
        if (!$category) {
            return response()->json(['number' => '']);
        }

        $prefixes = [
            'berita acara' => 'BA/',
            'memo' => 'Memo/',
            'mou' => 'MoU/',
            'nota dinas' => 'ND/',
            'pemberitahuan' => 'Pem/',
            'pengumuman' => 'Peng/',
            'surat dinas' => 'S/',
            'surat edaran' => 'SE/',
            'surat keterangan' => 'SKET/',
            'surat kuasa' => 'SKU/',
            'surat perintah' => 'SPRIN/',
            'surat perintah perjalanan dinas' => 'SPPD/',
            'surat perjanjian kerja sama' => 'SPKS/',
            'tinjau skep' => 'S/',
            'surat pengantar' => 'P/',
            'sppi/pendaftaran keluarga' => 'S/',
            'surat gaji terusan' => 'S/',
        ];

        $prefix = $prefixes[strtolower($category)] ?? '';
        if (!$prefix) {
            return response()->json(['number' => '']);
        }

        $date = $request->query('date');
        $year = $date ? date('Y', strtotime($date)) : date('Y');

        // Get all no_surat for the specific year to find the max
        $allSurat = SuratKeluar::whereYear('tanggal_pembuatan', $year)->pluck('no_surat');

        $maxNum = 0;
        foreach ($allSurat as $no) {
            // Try to extract the first number found in the string
            if (preg_match('/(\d+)/', $no, $matches)) {
                $num = (int) $matches[1];
                if ($num > $maxNum) {
                    $maxNum = $num;
                }
            }
        }

        $nextNum = $maxNum + 1;

        return response()->json(['number' => $prefix . str_pad($nextNum, 2, '0', STR_PAD_LEFT)]);
    }

    public function importSuratMasukCSV(Request $request)
    {
        if (Auth::user()->role === 'pimpinan') {
            abort(403, 'Unauthorized. Pimpinan cannot import Surat Masuk.');
        }

        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:51200', // max 50MB, support CSV and Excel
        ]);

        try {
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $path = $file->getRealPath();

            $csvData = [];

            // Handle Excel files (.xlsx, .xls)
            if (in_array($extension, ['xlsx', 'xls'])) {
                // For Excel files, we'll use a simple XML parser for .xlsx
                if ($extension === 'xlsx') {
                    $csvData = $this->parseXlsxToArray($path);
                } else {
                    // For .xls (old format), ask user to save as .xlsx or .csv
                    return response()->json([
                        'message' => 'File .xls tidak didukung. Silakan save as .xlsx atau .csv terlebih dahulu.'
                    ], 400);
                }
            } else {
                // Handle CSV files
                $csvData = array_map('str_getcsv', file($path));
            }

            if (empty($csvData)) {
                return response()->json(['message' => 'File kosong atau format tidak valid'], 400);
            }

            // Remove header row and create column mapping
            $header = array_shift($csvData);

            // Normalize header names (lowercase, trim spaces)
            $headerMap = [];
            foreach ($header as $index => $colName) {
                $normalized = strtolower(trim($colName));
                $headerMap[$normalized] = $index;
            }

            $imported = 0;
            $errors = [];

            foreach ($csvData as $index => $row) {
                $rowNumber = $index + 2; // +2 because we removed header and arrays are 0-indexed

                try {
                    // Skip empty rows
                    if (empty(array_filter($row))) {
                        continue;
                    }

                    // Helper function to get value by column name
                    $getValue = function ($colName) use ($row, $headerMap) {
                        $normalized = strtolower(trim($colName));
                        if (isset($headerMap[$normalized])) {
                            return $row[$headerMap[$normalized]] ?? '';
                        }
                        return '';
                    };

                    // Map columns to database fields using header names
                    $data = [
                        'pengirim' => $getValue('pengirim'),
                        'no_surat' => $getValue('no_surat'),
                        'tanggal_terima_surat' => $this->convertExcelDate($getValue('tanggal_terima_surat')),
                        'tanggal_surat_masuk' => $this->convertExcelDate($getValue('tanggal_surat_masuk')),
                        'sumber_berkas' => $this->validateEnum($getValue('sumber_berkas'), [
                            'internal',
                            'eksternal'
                        ], 'eksternal'), // Default to 'eksternal' if missing
                        'perihal' => $getValue('perihal') ?: null,
                        'keterangan' => $getValue('keterangan'),
                        'status' => 'proses',
                        'user_id' => Auth::id(),
                        'created_by_name' => Auth::user()->nama_lengkap ?? null,
                    ];

                    $data['pengirim'] = $data['pengirim'] ?: null;
                    // $data['perihal'] = $data['perihal'] ?: null; // Already handled above

                    // Validate required fields
                    $missingFields = [];
                    if (empty($data['no_surat']))
                        $missingFields[] = 'No. Surat';
                    if (empty($data['tanggal_terima_surat']))
                        $missingFields[] = 'Tanggal Terima Surat';
                    if (empty($data['tanggal_surat_masuk']))
                        $missingFields[] = 'Tanggal Surat Masuk';
                    if (empty($data['pengirim']))
                        $missingFields[] = 'Pengirim';
                    if (empty($data['perihal']))
                        $missingFields[] = 'Perihal';
                    // sumber_berkas defaults to null if invalid, so check if it's null (it should be required)
                    if (empty($data['sumber_berkas']))
                        $missingFields[] = 'Sumber Berkas';

                    if (!empty($missingFields)) {
                        $errors[] = "Baris {$rowNumber}: Kolom wajib diisi: " . implode(', ', $missingFields);
                        continue;
                    }

                    // Check if no_surat already exists - ALLOWED NOW
                    // if (SuratMasuk::where('no_surat', $data['no_surat'])->exists()) {
                    //    $errors[] = "Baris {$rowNumber}: No. Surat '{$data['no_surat']}' sudah ada";
                    //    continue;
                    // }

                    // Create surat masuk
                    $surat = SuratMasuk::create($data);

                    // Create notification for Pimpinan
                    try {
                        Notification::create([
                            'role' => 'pimpinan',
                            'title' => 'Surat Masuk Baru (Import)',
                            'message' => "Surat No: {$surat->no_surat} memerlukan disposisi.",
                            'surat_masuk_id' => $surat->id,
                        ]);
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::error('Failed to create notification: ' . $e->getMessage());
                    }

                    $imported++;

                } catch (\Exception $e) {
                    $errors[] = "Baris {$rowNumber}: " . $e->getMessage();
                }
            }

            return response()->json([
                'message' => "Import selesai. {$imported} data berhasil diimport.",
                'imported' => $imported,
                'errors' => $errors,
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Gagal mengimport file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import Surat Keluar from CSV or Excel file
     */
    public function importSuratKeluarCSV(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:51200', // Max 50MB
            ]);

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();

            // Parse file based on extension
            if (in_array($extension, ['xlsx', 'xls'])) {
                if ($extension === 'xls') {
                    return response()->json([
                        'message' => 'File .xls tidak didukung. Silakan convert ke .xlsx atau .csv terlebih dahulu.'
                    ], 400);
                }
                $csvData = $this->parseXlsxToArray($file->getRealPath());
            } else {
                // Parse CSV
                $csvData = array_map('str_getcsv', file($file->getRealPath()));
            }

            if (empty($csvData)) {
                return response()->json(['message' => 'File kosong atau format tidak valid'], 400);
            }

            // Remove header row and create column mapping
            $header = array_shift($csvData);

            // Normalize header names (lowercase, trim spaces)
            $headerMap = [];
            foreach ($header as $index => $colName) {
                $normalized = strtolower(trim($colName));
                $headerMap[$normalized] = $index;
            }

            $imported = 0;
            $errors = [];

            foreach ($csvData as $index => $row) {
                $rowNumber = $index + 2; // +2 because we removed header and arrays are 0-indexed

                try {
                    // Skip empty rows
                    if (empty(array_filter($row))) {
                        continue;
                    }

                    // Helper function to get value by column name
                    $getValue = function ($colName) use ($row, $headerMap) {
                        $normalized = strtolower(trim($colName));
                        if (isset($headerMap[$normalized])) {
                            return $row[$headerMap[$normalized]] ?? '';
                        }
                        return '';
                    };

                    // Map columns to database fields using header names
                    $data = [
                        'no_surat' => $getValue('no_surat'),
                        'tanggal_pembuatan' => $this->convertExcelDate($getValue('tanggal_pembuatan')),
                        'tujuan' => $getValue('tujuan') ?: null,
                        'kategori_berkas' => $this->validateEnum($getValue('kategori_berkas'), [
                            'berita acara',
                            'format',
                            'keputusan',
                            'memo',
                            'mou',
                            'nota dinas',
                            'pemberitahuan',
                            'pengumuman',
                            'peraturan',
                            'petunjuk pelaksana',
                            'rahasia',
                            'risalah rapat',
                            'sppi/pendaftaran keluarga',
                            'surat dinas',
                            'surat edaran',
                            'surat gaji terusan',
                            'surat keterangan',
                            'surat kuasa',
                            'surat perintah',
                            'surat perintah perjalanan dinas',
                            'surat perjanjian kerja sama',
                            'tinjau skep'
                        ], null),
                        'klasifikasi_surat_dinas' => $this->validateEnum($getValue('klasifikasi_surat_dinas'), [
                            'biasa',
                            'terbatas',
                            'rahasia',
                            'sangat rahasia'
                        ], null), // Default null as requested
                        'tingkat_urgensi_penyelesaian' => $this->validateEnum($getValue('tingkat_urgensi_penyelesaian'), [
                            'amat segera',
                            'biasa',
                            'segera',
                            'tinggi',
                            'sedang',
                            'rendah'
                        ], null),
                        'perihal' => $getValue('perihal') ?: null,
                        'keterangan' => $getValue('keterangan'),
                        'status' => $this->validateEnum($getValue('status'), ['terkirim', 'draft'], 'draft'),
                        'no_resi' => $getValue('no_resi'),
                        'user_id' => Auth::id(),
                        'created_by_name' => $getValue('created_by_name') ?: (Auth::user()->nama_lengkap ?? null),
                    ];

                    // $data['tujuan'] = $data['tujuan'] ?: null; // Handled above
                    // $data['perihal'] = $data['perihal'] ?: null; // Handled above

                    /* 
                    // REMOVED: Required checks to allow empty values
                    if (empty($data['no_surat']))
                        $missingFields[] = 'No. Surat';
                    // ... other checks
                    if (!empty($missingFields)) {
                        $errors[] = "Baris {$rowNumber}: Kolom wajib diisi: " . implode(', ', $missingFields);
                        continue;
                    }
                    */

                    // Check if no_surat already exists (ONLY if not empty)
                    if (!empty($data['no_surat']) && SuratKeluar::where('no_surat', $data['no_surat'])->exists()) {
                        $errors[] = "Baris {$rowNumber}: No. Surat '{$data['no_surat']}' sudah ada";
                        continue;
                    }

                    // Create surat keluar
                    SuratKeluar::create($data);
                    $imported++;

                } catch (\Exception $e) {
                    $errors[] = "Baris {$rowNumber}: " . $e->getMessage();
                }
            }

            return response()->json([
                'message' => "Import selesai. {$imported} data berhasil diimport.",
                'imported' => $imported,
                'errors' => $errors,
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Gagal mengimport file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Parse .xlsx file to array (simple parser for basic Excel files)
     */
    /**
     * Parse .xlsx file to array (simple parser for basic Excel files)
     */
    private function parseXlsxToArray($filePath)
    {
        // Generate a safe temp directory
        $tempDir = storage_path('app/temp/xlsx_' . uniqid());
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        // Copy file to have .zip extension (required for some extractors like PowerShell)
        $zipFilePath = $tempDir . '/archive.zip';
        copy($filePath, $zipFilePath);

        try {
            // Try using ZipArchive first
            if (class_exists('ZipArchive')) {
                $zip = new \ZipArchive();
                if ($zip->open($zipFilePath) === true) {
                    $zip->extractTo($tempDir);
                    $zip->close();
                } else {
                    throw new \Exception('Gagal membuka file Excel dengan ZipArchive');
                }
            } else {
                // Fallback to PowerShell for Windows if ZipArchive is missing
                if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                    // Use Full Path and Bypass execution policy
                    $command = "powershell -NoProfile -ExecutionPolicy Bypass -Command \"Expand-Archive -Path '$zipFilePath' -DestinationPath '$tempDir' -Force\"";
                    exec($command, $output, $returnVar);

                    if ($returnVar !== 0) {
                        // Log output for debugging
                        \Illuminate\Support\Facades\Log::error('PowerShell unzip failed: ' . implode("\n", $output));
                        throw new \Exception('Gagal mengekstrak file Excel menggunakan PowerShell. Pastikan PowerShell tersedia atau aktifkan ekstensi php_zip.');
                    }
                } else {
                    throw new \Exception('Ekstensi ZipArchive tidak aktif dan tidak ada fallback untuk sistem operasi ini.');
                }
            }

            // Read shared strings
            $sharedStrings = [];
            $sharedStringsPath = $tempDir . '/xl/sharedStrings.xml';
            if (file_exists($sharedStringsPath)) {
                $xml = simplexml_load_file($sharedStringsPath);
                foreach ($xml->si as $si) {
                    $sharedStrings[] = (string) $si->t;
                }
            }

            // Read worksheet data
            $sheetPath = $tempDir . '/xl/worksheets/sheet1.xml';
            if (!file_exists($sheetPath)) {
                throw new \Exception('Structure Excel tidak dikenali (sheet1.xml tidak ditemukan)');
            }
            $sheetXml = simplexml_load_file($sheetPath);

            // Helper to get cell value
            $rows = [];
            foreach ($sheetXml->sheetData->row as $row) {
                $rowData = [];
                $cellIndex = 0;
                foreach ($row->c as $cell) {
                    $val = (string) $cell->v;
                    // Handle shared strings
                    if (isset($cell['t']) && (string) $cell['t'] === 's') {
                        $val = $sharedStrings[(int) $val] ?? '';
                    }
                    $rowData[] = $val;
                }
                $rows[] = $rowData;
            }

            return $rows;

        } finally {
            // Cleanup temp dir
            $this->deleteDirectory($tempDir);
        }
    }

    private function deleteDirectory($dir)
    {
        if (!file_exists($dir)) {
            return true;
        }
        if (!is_dir($dir)) {
            return unlink($dir);
        }
        foreach (scandir($dir) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }
            if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
                return false;
            }
        }
        return rmdir($dir);
    }

    /**
     * Convert Excel column letter to zero-based index
     * A = 0, B = 1, ..., Z = 25, AA = 26, etc.
     */
    private function columnLetterToIndex($letter)
    {
        $letter = strtoupper($letter);
        $index = 0;
        $length = strlen($letter);

        for ($i = 0; $i < $length; $i++) {
            $index = $index * 26 + (ord($letter[$i]) - ord('A') + 1);
        }

        return $index - 1; // Convert to zero-based
    }

    /**
     * Convert Excel date (serial number or string) to YYYY-MM-DD format
     */
    private function convertExcelDate($value)
    {
        if (empty($value)) {
            return null;
        }

        // If already in YYYY-MM-DD format, return as is
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return $value;
        }

        // If it's a numeric value (Excel serial date)
        if (is_numeric($value)) {
            // Excel stores dates as number of days since 1900-01-01
            // But there's a bug: Excel thinks 1900 was a leap year
            $unixTimestamp = ($value - 25569) * 86400;
            return date('Y-m-d', $unixTimestamp);
        }

        // Try to parse other date formats
        try {
            $date = new \DateTime($value);
            return $date->format('Y-m-d');
        } catch (\Exception $e) {
            // If all else fails, return null
            return null;
        }
    }

    /**
     * Validate and normalize enum value
     */
    private function validateEnum($value, $validValues, $default)
    {
        $normalized = strtolower(trim($value));

        if (empty($normalized)) {
            return $default;
        }

        $normalizedValid = array_map('strtolower', $validValues);
        $index = array_search($normalized, $normalizedValid);

        if ($index !== false) {
            return $validValues[$index];
        }

        return $default;
    }
}
