<div id="disposisiModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
            onclick="closeDisposisiModal()"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                            Lembar Disposisi
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500 mb-4">
                                No. Surat: <span id="dispNoSurat" class="font-bold text-gray-800"></span>
                            </p>

                            <form id="disposisiForm" method="POST" action="">
                                @csrf
                                <!-- Diteruskan Kepada -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Diteruskan
                                        Kepada</label>
                                    <div class="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                                        <!-- Mock checkboxes - would be dynamic in real app -->
                                        <label class="inline-flex items-center">
                                            <input type="checkbox" name="targets[]" value="staff_umum"
                                                class="rounded border-gray-300 text-asabri-blue shadow-sm focus:border-asabri-gold focus:ring-asabri-gold">
                                            <span class="ml-2 text-sm text-gray-600">Staff Umum</span>
                                        </label><br>
                                        <label class="inline-flex items-center">
                                            <input type="checkbox" name="targets[]" value="staff_it"
                                                class="rounded border-gray-300 text-asabri-blue shadow-sm focus:border-asabri-gold focus:ring-asabri-gold">
                                            <span class="ml-2 text-sm text-gray-600">Staff IT</span>
                                        </label><br>
                                        <label class="inline-flex items-center">
                                            <input type="checkbox" name="targets[]" value="sekretaris"
                                                class="rounded border-gray-300 text-asabri-blue shadow-sm focus:border-asabri-gold focus:ring-asabri-gold">
                                            <span class="ml-2 text-sm text-gray-600">Sekretaris</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Instruksi -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Instruksi Khusus</label>
                                    <select name="instruction"
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring-asabri-gold">
                                        <option value="Tindak Lanjuti">Tindak Lanjuti</option>
                                        <option value="Segera">Segera</option>
                                        <option value="Untuk Diketahui">Untuk Diketahui</option>
                                        <option value="Arsipkan">Arsipkan</option>
                                    </select>
                                </div>

                                <!-- Catatan -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                                    <textarea name="notes" rows="3"
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring-asabri-gold"></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" onclick="document.getElementById('disposisiForm').submit()"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-asabri-gold text-base font-bold text-asabri-blue hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-asabri-gold sm:ml-3 sm:w-auto sm:text-sm">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    Kirim Disposisi
                </button>
                <button type="button" onclick="closeDisposisiModal()"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Batal
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    function openDisposisiModal(id, noSurat) {
        document.getElementById('disposisiModal').classList.remove('hidden');
        document.getElementById('dispNoSurat').innerText = noSurat;
        // Update form action dynamically
        document.getElementById('disposisiForm').action = "/surat-masuk/" + id + "/disposisi";
    }

    function closeDisposisiModal() {
        document.getElementById('disposisiModal').classList.add('hidden');
    }
</script>