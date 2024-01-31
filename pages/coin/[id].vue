<script setup>
import { useCurrency } from "~/composables/useCurrency";
import { useStrLimit } from "~/composables/useStrLimit";
const route = useRoute();

const {
  data: coin,
  pending: coinP,
  error,
} = await useAsyncData("cart-discount", async () => {
  const [data, chart] = await Promise.all([
    $fetch(`https://api.coingecko.com/api/v3/coins/${route.params.id}`),
    $fetch(
      `https://api.coingecko.com/api/v3/coins/${route.params.id}/market_chart?vs_currency=usd&id=${route.params.id}&days=7`,
    ),
  ]);

  return { data, chart };
});

if (error.value) {
  throw createError({
    statusCode: 500,
    message: "Something bad happened on the server.please try again later!",
  });
}
const tabItems = ref(["Chart", "Market", "About"]);
const selectedTab = ref("Chart");
const tab = (tab) => {
  selectedTab.value = tab;
};

const series = ref([
  {
    // name: "series1",
    data: coin.value.chart.prices,
  },
]);
const chartOptions = ref({
  chart: {
    height: 350,
    type: "area",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
    categories: [
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      "2018-09-19T04:30:00.000Z",
      "2018-09-19T05:30:00.000Z",
      "2018-09-19T06:30:00.000Z",
    ],
  },
  tooltip: {
    // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //   return (
    //     '<div class="px-4 py-3 ">' +
    //     "<span>" +
    //     series[seriesIndex][dataPointIndex] +
    //     w +
    //     "</span>" +
    //     "</div>"
    //   );
    // },
    // x: {
    //   format: "dd/MM/yy HH:mm",
    // },
  },
});
</script>

<template>
  <div class="px-3 max-w-screen-xl mx-auto py-16">
    <ul class="flex items-center gap-x-4 text-sm mb-7">
      <li>
        <NuxtLink to="/"> Cryptocurrency </NuxtLink>
        <span class="icon-chevron-left rotate-180 inline-block"></span>
      </li>

      <li class="text-slate-500">
        <NuxtLink :to="`/${route.params.id}`"> {{ route.params.id }} </NuxtLink>
      </li>
    </ul>
    <div class="md:flex items-start gap-x-8">
      <div class="basis-96 border py-4 max-md:mb-3">
        <div class="flex items-center gap-x-5 mb-3 px-4">
          <img
            :src="coin.data.image.thumb"
            alt="coin logo"
            class="w-4 h-4 lg:w-6 lg:h-6 rounded-full object-cover"
          />
          <h1 class="text-3xl font-bold">
            {{ coin.data.name }}
          </h1>

          <span class="text-slate-500 uppercase">
            {{ coin.data.symbol }}
          </span>

          <button
            class="w-8 h-8 bg-gray-300 rounded-sm ml-auto flex items-center justify-center"
          >
            <span class="icon-star"></span>
          </button>
          <button
            class="w-8 h-8 bg-gray-300 rounded-sm flex items-center justify-center"
          >
            <span class="icon-share-2"></span>
          </button>
        </div>

        <div class="flex items-center gap-x-3 mb-3 px-4">
          <p class="text-3xl font-bold">
            ${{ useCurrency(coin.data.market_data.current_price.usd) }}
          </p>

          <p
            class="font-bold text-xs text-red-400 flex justify-end items-center"
            :class="
              coin.data.market_data.price_change_24h.toString().includes('-')
                ? 'text-red-400'
                : 'text-green-400 '
            "
          >
            <span
              class="icon-chevron-down text-2xl"
              :class="
                !coin.data.market_data.price_change_24h
                  .toString()
                  .includes('-') && 'inline-block rotate-180'
              "
            ></span>

            {{ useStrLimit(coin.data.market_data.price_change_24h, 5) }}%
          </p>
        </div>

        <ul class="divide-y px-4">
          <li class="flex items-center justify-between py-2">
            <p class="text-sm text-gray-500">
              Market cap

              <span class="icon-alert-circle"></span>
            </p>
            <p
              class="font-bold text-xs text-red-400 flex justify-end items-center"
              :class="
                coin.data.market_data.market_cap_change_24h
                  .toString()
                  .includes('-')
                  ? 'text-red-400'
                  : 'text-green-400 '
              "
            >
              <span
                class="icon-chevron-down text-2xl"
                :class="
                  !coin.data.market_data.market_cap_change_24h
                    .toString()
                    .includes('-') && 'inline-block rotate-180'
                "
              ></span>

              {{ useStrLimit(coin.data.market_data.market_cap_change_24h, 5) }}%
            </p>

            <p class="">
              ${{ useCurrency(coin.data.market_data.market_cap.usd) }}
            </p>
          </li>
          <li class="flex items-center justify-between py-2">
            <p class="text-sm text-gray-500">
              Volume (24h)

              <span class="icon-alert-circle"></span>
            </p>

            <p class="">
              ${{ useCurrency(coin.data.market_data.total_volume.usd) }}
            </p>
          </li>
          <li class="flex items-center justify-between py-2">
            <p class="text-sm text-gray-500">
              Total supply

              <span class="icon-alert-circle"></span>
            </p>

            <p class="">
              ${{ useCurrency(coin.data.market_data.total_supply) }}
            </p>
          </li>
          <li class="flex items-center justify-between py-2">
            <p class="text-sm text-gray-500">
              Max. supply

              <span class="icon-alert-circle"></span>
            </p>

            <p class="">${{ useCurrency(coin.data.market_data.max_supply) }}</p>
          </li>
        </ul>
      </div>

      <div class="flex-1">
        <div class="overflow-hidden border-b">
          <ul class="flex items-center gap-x-4">
            <li v-for="item in tabItems" :key="item">
              <a
                @click="tab(item)"
                :href="`#${item}`"
                :class="selectedTab === item && 'text-blue-600 border-b'"
                class="block hover:text-blue-600 hover:border-b border-blue-600 active:text-blue-600 active:border-b pb-3"
              >
                {{ item }}
              </a>
            </li>
          </ul>
        </div>

        <!-- ===========Chart=========== -->

        <div id="Chart" class="h-96">
          <ClientOnly>
            <apexchart
              type="area"
              height="350"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </ClientOnly>
        </div>
        <!-- ===========Market=========== -->

        <div id="Market" class="h-96"></div>

        <!-- ===========About=========== -->
        <div class="" id="About">
          <h2 class="text-2xl font-bold mb-4">About {{ coin.data.name }}</h2>

          <h4 class="text-lg font-medium mb-3">
            What Is {{ coin.data.name }}
            <span class="uppercase">
              (

              {{ coin.data.symbol }}
              )
            </span>
            ?
          </h4>
          <div class="text-justify" v-html="coin.data.description.en"></div>
        </div>
      </div>
    </div>
  </div>
</template>
