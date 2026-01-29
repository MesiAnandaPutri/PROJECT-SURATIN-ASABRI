<x-app-layout>
    <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Buat Surat Keluar</h2>
        <p class="text-gray-600">Formulir pembuatan surat keluar baru.</p>
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <form action="{{ route('surat-keluar.store') }}" method="POST" enctype="multipart/form-data" class="p-8">
            @csrf

            <div class="grid grid-cols-12 gap-6">
                <!-- Nomor Surat -->
                <div class="col-span-12 md:col-span-4 flex items-center">
                    <label class="block text-sm font-bold text-asabri-blue uppercase tracking-wide">Nomor Surat</label>
                </div>
                <div class="col-span-12 md:col-span-8">
                    <input type="text" name="nomor_surat" value="{{ old('nomor_surat') }}"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50"
                        required>
                </div>

                <!-- Tanggal Surat -->
                <div class="col-span-12 md:col-span-4 flex items-center">
                    <label class="block text-sm font-bold text-asabri-blue uppercase tracking-wide">Tanggal
                        Surat</label>
                </div>
                <div class="col-span-12 md:col-span-8">
                    <input type="date" name="tanggal_surat" value="{{ old('tanggal_surat') }}"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50"
                        required>
                </div>

                <!-- Tanggal Dikirim -->
                <div class="col-span-12 md:col-span-4 flex items-center">
                    <label class="block text-sm font-bold text-asabri-blue uppercase tracking-wide">Tanggal
                        Dikirim</label>
                </div>
                <div class="col-span-12 md:col-span-8">
                    <input type="date" name="tanggal_dikirim" value="{{ old('tanggal_dikirim') }}"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50"
                        required>
                </div>

                <!-- Tujuan -->
                <div class="col-span-12 md:col-span-4 flex items-center">
                    <label class="block text-sm font-bold text-asabri-blue uppercase tracking-wide">Tujuan /
                        Penerima</label>
                </div>
                <div class="col-span-12 md:col-span-8">
                    <input type="text" name="tujuan" value="{{ old('tujuan') }}"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50"
                        required>
                </div>

                <!-- Kategori -->
                <div class="col-span-12 md:col-span-4 flex items-center">
                    <label class="block text-sm font-bold text-asabri-blue uppercase tracking-wide">Kategori
                        Berkas</label>
                </div>
                <div class="col-span-12 md:col-span-8">
                    <select name="kategori_id"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50"
                        required>
                        <option value="">-- Pilih Kategori --</option>
                        @foreach($categories as $cat)
                            <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Perihal -->
                <div class="col-span-12 md:col-span-4 flex items-start mt-2">
                    <label class="block text-sm font-bold text-asabri-blue uppercase tracking-wide">Perihal</label>
                </div>
                <div class="col-span-12 md:col-span-8">
                    <textarea name="perihal" rows="3"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50"
                        required>{{ old('perihal') }}</textarea>
                </div>

                <!-- Keterangan -->
                <div class="col-span-12 md:col-span-4 flex items-start mt-2">
                    <label class="block text-sm font-bold text-asabri-blue uppercase tracking-wide">Keterangan</label>
                </div>
                <div class="col-span-12 md:col-span-8">
                    <textarea name="keterangan" rows="3"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50">{{ old('keterangan') }}</textarea>
                </div>

                <!-- Upload -->
                <div class="col-span-12 md:col-span-4 flex items-center">
                    <label class="block text-sm font-bold text-asabri-blue uppercase tracking-wide">Upload Berkas
                        (PDF)</label>
                </div>
                <div class="col-span-12 md:col-span-8">
                    <input type="file" name="file_surat" accept="application/pdf" class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-asabri-blue
                        hover:file:bg-blue-100" required>
                    <p class="mt-1 text-sm text-gray-500">Max size: 10MB.</p>
                </div>
            </div>

            <div class="mt-8 border-t border-gray-200 pt-6 flex justify-end">
                <a href="{{ route('surat-keluar.index') }}"
                    class="mr-4 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">Batal</a>
                <button type="submit"
                    class="px-8 py-3 bg-asabri-gold text-asabri-blue font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-all transform hover:scale-105">
                    Simpan & Kirim
                </button>
            </div>
        </form>
    </div>
</x-app-layout>