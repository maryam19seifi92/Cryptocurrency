<script setup>
import { ref, computed } from "vue";
import { useCurrency } from "~/composables/useCurrency";
import { useStrLimit } from "~/composables/useStrLimit";

const clones = ref([]);
const search = ref("");

// const {
//   data: coins,
//   pending: tenItemsPending,
//   error: tenItemsError,
//   refresh,
// } = await useAsyncData("coinsList", () =>
//   $fetch(
//     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h",
//   ),
// );

const { data: coins, error } = await useAsyncData(() =>
  $fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h",
  ),
);

if (error.value) {
  throw createError({
    statusCode: 500,
    message: "Something bad happened on the server.please try again later!",
  });
}

const tenItems = computed(() => {
  return coins.value.slice(0, 10);
});

const matchingNames = computed(() => {
  return coins.value.filter(
    (name) =>
      name.id.includes(search.value) || name.symbol.includes(search.value),
  );
});

watchEffect(() => {
  const dup = coins.value.slice(0, 5);
  clones.value = dup;
});
</script>

<template>
  <!-- ============ Marquee ============ -->
  <div
    class="marquee w-full h-12 overflow-hidden bg-black position-relative mb-16"
  >
    <ul class="marquee-content h-full flex" ref="mq">
      <!-- main -->
      <li
        v-for="coin in tenItems"
        :key="coin.name"
        class="flex justify-center items-center flex-shrink-0 text-white transform scale-75 lg:scale-100"
      >
        <div class="flex justify-between w-3/4">
          <!-- ticker -->
          <div class="flex items-center">
            <img
              :src="coin.image"
              alt="coin logo"
              class="w-4 h-4 lg:w-6 lg:h-6 rounded-full mr-4 object-cover"
            />
            <div class="hidden lg:block">
              <p class="font-bold">{{ coin.name }}</p>
              <p class="text-xs uppercase tracking-widest">
                {{ coin.symbol }}
              </p>
            </div>
          </div>
          <!-- price -->
          <div>
            <p class="font-bold text-xs lg:text-base flex justify-end">
              {{ useCurrency(coin.current_price) }}
            </p>
            <p
              class="font-bold text-xs text-red-400 flex justify-end items-center"
              :class="
                coin.price_change_percentage_24h.toString().includes('-')
                  ? 'text-red-400'
                  : 'text-green-400 '
              "
            >
              <span
                class="icon-chevron-down text-2xl"
                :class="
                  !coin.price_change_percentage_24h.toString().includes('-') &&
                  'inline-block rotate-180'
                "
              ></span>

              {{ useStrLimit(coin.price_change_percentage_24h, 5) }}%
            </p>
          </div>
        </div>
      </li>
      <!-- clones -->
      <li
        v-for="clone in clones"
        :key="clone.name"
        class="flex justify-center items-center flex-shrink-0 text-white transform scale-75 lg:scale-100"
      >
        <div class="flex justify-between w-3/4">
          <!-- ticker -->
          <div class="flex items-center">
            <img
              :src="clone.image"
              alt="coin logo"
              class="w-4 h-4 lg:w-6 lg:h-6 rounded-full mr-4 object-cover"
            />
            <div class="hidden lg:block">
              <p class="font-bold">{{ clone.name }}</p>
              <p class="text-xs uppercase tracking-widest">
                {{ clone.symbol }}
              </p>
            </div>
          </div>
          <!-- price -->
          <div>
            <p class="font-bold flex justify-end text-xs lg:text-base">
              {{ useCurrency(clone.current_price) }}
            </p>

            <p
              class="font-bold text-xs text-red-400 flex justify-end items-center"
              :class="
                clone.price_change_percentage_24h.toString().includes('-')
                  ? 'text-red-400'
                  : 'text-green-400 '
              "
            >
              <span
                class="icon-chevron-down text-2xl"
                :class="
                  !clone.price_change_percentage_24h.toString().includes('-') &&
                  'inline-block rotate-180'
                "
              ></span>

              {{ useStrLimit(clone.price_change_percentage_24h, 5) }}%
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <div class="container mx-auto pt-18 pb-48 px-2">
    <!-- search -->
    <div class="flex justify-end pb-2">
      <div class="relative">
        <input
          type="text"
          placeholder="search..."
          class="border border-gray-500 rounded p-2 focus:outline-none focus:ring focus:ring-gray-300"
          v-model="search"
        />

        <span
          class="icon-search text-gray-500 absolute right-2 top-2/4 transform -translate-y-1/2"
        ></span>
      </div>
    </div>
    <!-- table -->
    <table class="table-fixed cursor-pointer">
      <!-- head -->
      <thead class="bg-gray-200">
        <tr class="text-left text-gray-600 text-sm">
          <th class="w-1/4 p-4">Name</th>
          <th class="w-1/4">Price</th>
          <th class="w-1/4">1h %</th>
          <th class="w-1/4 hidden sm:table-cell">Market Cap</th>
          <th class="w-1/4 hidden sm:table-cell">Volume</th>
        </tr>
      </thead>
      <!-- body -->
      <tbody class="divide-y">
        <tr
          class="text-sm hover:bg-gray-100 transition duration-300"
          v-for="coin in matchingNames"
          :key="coin.name"
          @click="navigateTo(`/coin/${coin.id}`)"
        >
          <td class="p-4 flex items-center">
            <p class="mr-2">{{ coin.market_cap_rank }}</p>
            <img
              :src="coin.image"
              alt="coin logo"
              class="w-6 h-6 rounded-full mr-1"
            />
            <p class="font-bold mr-1">{{ coin.name }}</p>
            <p class="uppercase text-gray-500 hidden sm:table-cell">
              {{ coin.symbol }}
            </p>
          </td>
          <td class="font-bold">${{ useCurrency(coin.current_price) }}</td>
          <td class="font-bold">
            <div
              class="flex items-center"
              :class="
                coin.price_change_percentage_24h.toString().includes('-')
                  ? 'text-red-500'
                  : 'text-green-500'
              "
            >
              <span
                class="icon-chevron-down text-2xl"
                :class="
                  !coin.price_change_percentage_24h.toString().includes('-') &&
                  'inline-block rotate-180'
                "
              ></span>

              {{ coin.market_cap_change_percentage_24h }}%
            </div>
          </td>
          <td class="hidden sm:table-cell">
            ${{ useCurrency(coin.market_cap) }}
          </td>
          <td class="pr-4 hidden sm:table-cell">
            {{ useCurrency(coin.total_volume) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.marquee-content {
  animation: scrolling 20s linear infinite;
}
.marquee-content:hover {
  animation-play-state: paused;
}
.marquee-content li {
  width: 20%;
}
.marquee:before,
.marquee:after {
  position: absolute;
  top: 0;
  width: 10rem;
  height: 3em;
  content: "";
  z-index: 1;
}
.marquee:before {
  left: 0;
  background: linear-gradient(to right, #111 0%, transparent 100%);
}
.marquee:after {
  right: 0;
  background: linear-gradient(to left, #111 0%, transparent 100%);
}

@keyframes scrolling {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-200%);
  }
}
</style>
