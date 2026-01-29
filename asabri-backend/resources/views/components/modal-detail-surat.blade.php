<!-- Modal Detail -->
<div id="detailModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
            onclick="closeDetailModal()"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
            class="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-5xl w-full">
            <div class="bg-asabri-blue px-6 py-4 flex justify-between items-center">
                <h3 class="text-xl leading-6 font-bold text-white" id="modal-title">
                    Detail Surat: <span id="detailNoSurat">Wait..</span>
                </h3>
                <button onclick="closeDetailModal()" class="text-white hover:text-gray-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>

            <div class="bg-white px-6 py-4">
                <div class="flex flex-col md:flex-row gap-6 h-[600px]">
                    <!-- Left Pane: Data -->
                    <div class="w-full md:w-[45%] overflow-y-auto pr-2 space-y-4">
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Nomor Surat</label>
                            <p class="text-sm font-bold text-gray-900" id="detailNoSuratVal">-</p>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Tanggal Surat</label>
                            <p class="text-sm text-gray-900" id="detailTanggal">-</p>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Pengirim / Tujuan</label>
                            <p class="text-sm text-gray-900" id="detailParty">-</p>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Perihal</label>
                            <p class="text-sm text-gray-900" id="detailPerihal">-</p>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Keterangan</label>
                            <p class="text-sm text-gray-900" id="detailKeterangan">-</p>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Status</label>
                            <span id="detailStatus"
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                -
                            </span>
                        </div>

                        <div class="border-t border-gray-200 pt-4 mt-6">
                            <h4 class="font-bold text-gray-800 mb-2">Riwayat Disposisi</h4>
                            <ul class="text-sm space-y-2" id="detailHistory">
                                <!-- Mock history -->
                                <li class="text-gray-500 italic">Belum ada riwayat disposisi.</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Right Pane: PDF Preview -->
                    <div
                        class="w-full md:w-[55%] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300 relative">
                        <!-- If we had a real PDF URL, we'd use <iframe src="..." class="w-full h-full"></iframe> -->
                        <div class="text-center p-6">
                            <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                </path>
                            </svg>
                            <p class="text-gray-500 font-medium">PDF Preview</p>
                            <p class="text-xs text-gray-400 mt-1">Dokumen belum dimuat</p>
                        </div>
                        <iframe id="pdfPreview" class="absolute inset-0 w-full h-full hidden" src=""></iframe>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 px-6 py-4 flex justify-between items-center sm:flex-row-reverse">
                <div class="flex gap-2">
                    <button type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-asabri-blue text-base font-bold text-white hover:bg-blue-800 focus:outline-none sm:w-auto sm:text-sm">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Download PDF
                    </button>
                    <button type="button"
                        class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                            </path>
                        </svg>
                        Cetak
                    </button>
                </div>
                <div class="text-sm text-gray-400">
                    ID: <span id="detailId">#</span>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function openDetailModal(id) {
        // In a real app, you would fetch data via AJAX here
        // fetch('/api/surat-detail/' + id).then(res => res.json()).then(data => { ... })

        document.getElementById('detailModal').classList.remove('hidden');
        document.getElementById('detailNoSurat').innerText = 'SURAT-2023-00' + id; // Mock
        document.getElementById('detailNoSuratVal').innerText = 'SURAT-2023-00' + id;
    }

    function closeDetailModal() {
        document.getElementById('detailModal').classList.add('hidden');
    }
</script>