<x-guest-layout>
    <!-- Logo -->
    <div class="flex justify-center mb-6">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-white tracking-widest">ASABRI</h1>
            <p class="text-asabri-gold text-sm tracking-wider uppercase font-semibold">Mail Management</p>
        </div>
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Email Address -->
        <div>
            <label for="email" class="block font-medium text-sm text-white">Email / NRP</label>
            <input id="email"
                class="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50 bg-white/90 text-gray-900 px-4 py-2"
                type="email" name="email" :value="old('email')" required autofocus />
            <x-input-error :messages="$errors->get('email')" class="mt-2 text-red-300" />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <label for="password" class="block font-medium text-sm text-white">Password</label>
            <input id="password"
                class="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50 bg-white/90 text-gray-900 px-4 py-2"
                type="password" name="password" required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2 text-red-300" />
        </div>

        <!-- Remember Me -->
        <div class="block mt-4">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox"
                    class="rounded border-gray-300 text-asabri-gold shadow-sm focus:border-asabri-gold focus:ring focus:ring-asabri-gold/50 font-bold"
                    name="remember">
                <span class="ml-2 text-sm text-gray-200">{{ __('Remember me') }}</span>
            </label>
        </div>

        <div class="flex items-center justify-end mt-4">
            <button
                class="w-full bg-asabri-gold hover:bg-yellow-600 text-asabri-blue font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out uppercase tracking-wide">
                {{ __('Masuk') }}
            </button>
        </div>
    </form>
</x-guest-layout>