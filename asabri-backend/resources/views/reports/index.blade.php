<x-app-layout>
    <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Laporan & Rekapitulasi Surat</h2>
        <p class="text-gray-600">Lihat dan export laporan surat masuk dan keluar.</p>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <form action="{{ route('reports.index') }}" method="GET"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Periode</label>
                <div class="flex gap-2">
                    <input type="date" name="start_date" value="{{ request('start_date') }}"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring-asabri-gold">
                    <span class="self-center">-</span>
                    <input type="date" name="end_date" value="{{ request('end_date') }}"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring-asabri-gold">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Surat</label>
                <select name="type"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring-asabri-gold">
                    <option value="all" {{ request('type') == 'all' ? 'selected' : '' }}>Semua</option>
                    <option value="masuk" {{ request('type') == 'masuk' ? 'selected' : '' }}>Surat Masuk</option>
                    <option value="keluar" {{ request('type') == 'keluar' ? 'selected' : '' }}>Surat Keluar</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring-asabri-gold">
                    <option value="">Semua Status</option>
                    <option value="Pending" {{ request('status') == 'Pending' ? 'selected' : '' }}>Pending</option>
                    <option value="Selesai" {{ request('status') == 'Selesai' ? 'selected' : '' }}>Selesai</option>
                    <option value="Dikirim" {{ request('status') == 'Dikirim' ? 'selected' : '' }}>Dikirim</option>
                </select>
            </div>

            <div class="flex gap-2">
                <button type="submit"
                    class="flex-1 bg-asabri-blue text-white py-2 px-4 rounded-md hover:bg-blue-800 transition font-medium">
                    Tampilkan
                </button>
                <a href="{{ route('reports.export', request()->all()) }}"
                    class="flex-1 bg-asabri-gold text-asabri-blue py-2 px-4 rounded-md hover:bg-yellow-500 transition font-bold text-center flex justify-center items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    Export
                </a>
            </div>
        </form>
    </div>

    <!-- Results Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tanggal</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.
                            Surat</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Perihal</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($reports as $index => $row)
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $index + 1 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ \Carbon\Carbon::parse($row->date)->format('d M Y') }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $row->type == 'Surat Masuk' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800' }}">
                                    {{ $row->type }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $row->no_surat }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{{ $row->subject }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ $row->status }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Tidak ada data untuk periode ini.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if(method_exists($reports, 'links'))
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
                {{ $reports->links() }}
            </div>
        @endif
    </div>
</x-app-layout>