<x-app-layout>
    <div class="mb-6 flex justify-between items-center">
        <div>
            <h2 class="text-2xl font-bold text-gray-800">Surat Masuk</h2>
            <p class="text-gray-600">Kelola berkas dan surat masuk digital.</p>
        </div>
        @if(in_array(Auth::user()->role, ['admin', 'staff']))
            <a href="{{ route('surat-masuk.create') }}"
                class="bg-asabri-gold hover:bg-yellow-600 text-asabri-blue font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Tambah Surat
            </a>
        @endif
    </div>

    <!-- Search & Filter -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form action="{{ route('surat-masuk.index') }}" method="GET" class="flex gap-4">
            <div class="flex-1">
                <input type="text" name="search" value="{{ request('search') }}"
                    placeholder="Cari No. Surat atau Perihal..."
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50">
            </div>
            <button type="submit"
                class="bg-asabri-blue text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">Cari</button>
        </form>
    </div>

    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-asabri-blue text-white">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">No</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Tanggal Diterima</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Pengirim</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Perihal</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">No. Surat</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($suratMasuk as $index => $surat)
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $index + $suratMasuk->firstItem() }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ \Carbon\Carbon::parse($surat->tanggal_diterima)->format('d M Y') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ $surat->pengirim }}
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ $surat->perihal }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $surat->nomor_surat }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        {{ $surat->status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : '' }}
                                        {{ $surat->status === 'Disposisi' ? 'bg-green-100 text-green-800' : '' }}
                                        {{ $surat->status === 'Selesai' ? 'bg-blue-100 text-blue-800' : '' }}">
                                    {{ $surat->status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                <!-- Detail Button -->
                                <button onclick="openDetailModal({{ $surat->id }})"
                                    class="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-md">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                        </path>
                                    </svg>
                                </button>

                                @if(in_array(Auth::user()->role, ['admin', 'staff']))
                                    <!-- Edit -->
                                    <a href="{{ route('surat-masuk.edit', $surat->id) }}"
                                        class="text-yellow-600 hover:text-yellow-900 bg-yellow-50 p-2 rounded-md">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                            </path>
                                        </svg>
                                    </a>
                                @endif

                                @if(Auth::user()->role === 'pimpinan')
                                    <!-- Disposisi Button -->
                                    <button onclick="openDisposisiModal({{ $surat->id }}, '{{ $surat->nomor_surat }}')"
                                        class="text-asabri-gold hover:text-yellow-700 bg-yellow-50 p-2 rounded-md"
                                        title="Disposisi">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                        </svg>
                                    </button>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-4 text-center text-gray-500">Tidak ada data surat masuk.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {{ $suratMasuk->links() }}
        </div>
    </div>
</x-app-layout>