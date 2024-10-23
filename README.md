# Countries api

Get access to the endpoints here: https://countries.xamu.com.co/

Data provided by: https://github.com/dr5hn/countries-states-cities-database

# Nuxt Module

[![npm (scoped)](https://img.shields.io/npm/v/nuxt-countries-api)](https://github.com/vis97c/countries-api/tree/master) [![CircleCI](https://dl.circleci.com/status-badge/img/gh/vis97c/countries-api/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/vis97c/countries-api/tree/master)

```shell
npm i nuxt-countries-api
# or with yarn
yarn add nuxt-countries-api
```

## Usage

Add to `modules` in `nuxt.config.ts`:

```js
// nuxt.config.ts, basic setup

export default defineNuxtConfig({
	modules: ["nuxt-countries-api"],
});
```

## Settings

```js
// nuxt.config.ts, example configuration

export default defineNuxtConfig({
	modules: ["nuxt-countries-api"],
	countries: {
		base: "/_countries",
	},
});
```

| Name | Type   | Default          | Description                         |
| ---- | ------ | ---------------- | ----------------------------------- |
| base | string | "/api/countries" | Base path to be used on nuxt server |

## Development

```bash
$ yarn dev
```

preserveSymlinks could break the module

## License

[MIT](http://opensource.org/licenses/MIT)
