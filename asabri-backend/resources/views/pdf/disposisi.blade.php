<!DOCTYPE html>
<html>

<head>
    <title>Lembar Disposisi</title>
    <style>
        @page {
            margin: 10px 20px;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            /* Reduced font size */
        }

        .header {
            width: 100%;
            margin-bottom: 5px;
            /* Reduced margin */
        }

        .logo {
            width: 180px;
            /* Slightly smaller logo */
        }

        .title {
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            /* Reduced title size */
            margin-top: 5px;
            margin-bottom: 10px;
            /* Reduced margin */
        }

        .info-table {
            width: 100%;
            margin-bottom: 10px;
            /* Reduced margin */
        }

        .info-table td {
            padding: 1px;
            vertical-align: top;
        }

        .main-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid black;
        }

        .main-table th,
        .main-table td {
            border: 1px solid black;
            padding: 3px;
            /* Reduced padding */
            vertical-align: top;
        }

        .main-table th {
            text-align: center;
            font-weight: bold;
            background-color: #f0f0f0;
        }

        .aksi-col {
            width: 50%;
        }

        .catatan-col {
            width: 50%;
        }

        .checkbox-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .checkbox-item {
            margin-bottom: 2px;
            /* Reduced item margin */
        }

        .signature-section {
            margin-top: 20px;
            /* Reduced margin */
            text-align: right;
            padding-right: 30px;
        }

        .signature-name {
            margin-top: 50px;
            /* Reduced signature space */
            font-weight: bold;
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="header">
        <div style="margin-bottom: 10px;">
            <img src="{{ public_path('LogoAsabri1.png') }}" alt="ASABRI" class="logo" style="width: 200px;"
                onerror="this.style.display='none'">
        </div>
        <div class="title">LEMBAR DISPOSISI</div>
    </div>

    <table class="info-table">
        <tr>
            <td width="15%">Dari</td>
            <td width="2%">:</td>
            <td>Kakancab</td>
        </tr>
        <tr>
            <td>Tanggal</td>
            <td>:</td>
            <td>{{ \Carbon\Carbon::parse($disposisi->created_at)->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td>Hal</td>
            <td>:</td>
            <td>{{ $surat->perihal ?? '-' }}</td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                @php
                    $recipients = is_array($disposisi->diteruskan_kepada) ? $disposisi->diteruskan_kepada : [$disposisi->diteruskan_kepada];
                    $count = count($recipients);
                    $half = ceil($count / 2);
                    $leftSide = array_slice($recipients, 0, $half);
                    $rightSide = array_slice($recipients, $half);
                @endphp
                <td style="width: 50%; vertical-align: top; height: 30px;">
                    @foreach($leftSide as $index => $name)
                        <div style="margin-bottom: 5px;">{{ $index + 1 }}. Yth. {{ $name }}</div>
                    @endforeach
                </td>
                <td style="width: 50%; vertical-align: top; height: 30px;">
                    @foreach($rightSide as $index => $name)
                        <div style="margin-bottom: 5px;">{{ $index + 1 + $half }}. Yth. {{ $name }}</div>
                    @endforeach
                </td>
            </tr>
            <tr>
                <th colspan="2">AKSI</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="aksi-col">
                    @php
                        $selectedInstruction = $disposisi->instruksi ?? '';
                        // Define items with their display HTML and value for comparison
                        $items = [
                            ['val' => 'ACC/Setuju', 'html' => 'ACC/Setuju'],
                            ['val' => 'Agar Ditindaklanjuti', 'html' => 'Agar Ditindaklanjuti'],
                            ['val' => 'Buat Resume', 'html' => 'Buat <em>Resume</em>'],
                            ['val' => 'Koordinasikan', 'html' => 'Koordinasikan'],
                            ['val' => 'Sebagai Info', 'html' => 'Sebagai Info'],
                            ['val' => 'Laksanakan Sesuai Dengan Ketentuan', 'html' => 'Laksanakan Sesuai Dengan Ketentuan'],
                            ['val' => 'Lakukan Kajian', 'html' => 'Lakukan Kajian'],
                            ['val' => 'Menghadap', 'html' => 'Menghadap'],
                            ['val' => 'Monitor Perkembangannya', 'html' => 'Monitor Perkembangannya'],
                            ['val' => 'Pelajari/Ajukan Saran', 'html' => 'Pelajari/Ajukan Saran'],
                            ['val' => 'Selesaikan', 'html' => 'Selesaikan'],
                            ['val' => 'Simpan', 'html' => 'Simpan'],
                            ['val' => 'Untuk Diketahui', 'html' => 'Untuk Diketahui'],
                            ['val' => 'Untuk Dilaksanakan', 'html' => 'Untuk Dilaksanakan'],
                            ['val' => 'Copy', 'html' => '<em>Copy</em>'],
                        ];
                    @endphp
                    <ol style="margin: 0; padding-left: 20px;">
                        @foreach($items as $item)
                            <li class="checkbox-item">
                                @if(strcasecmp($item['val'], $selectedInstruction) == 0)
                                    <strong>{!! $item['html'] !!}</strong>
                                @else
                                    {!! $item['html'] !!}
                                @endif
                            </li>
                        @endforeach
                    </ol>
                </td>
                <td class="catatan-col">
                    <strong>Catatan:</strong>
                    <div style="margin-top: 10px;">
                        {!! nl2br(e($disposisi->catatan ?? '')) !!}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="signature-section">
        <p>KAKANCAB,</p>
        <div class="signature-name">
            {{ $pimpinan_name ?? 'SALIM ACHMAD' }}
        </div>
    </div>
</body>

</html>