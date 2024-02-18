<template>
	<div class="view">
		<div class="view-item --pY-60">
			<div class="holder flx --flxColumn --flx-center-start --gap-30">
				<h1 class="--txtColor">Countries API</h1>
				<div class="txt --gaping-5">
					<p class="--txtColor-dark5">
						Public REST API with countries data, based on
						<XamuActionLink
							href="https://github.com/dr5hn/countries-states-cities-database"
						>
							@dr5hn countries database
						</XamuActionLink>
						.
					</p>
				</div>
				<div class="txt --gaping-5">
					<p>
						<b>
							Use the
							<XamuActionLink href="https://www.npmjs.com/package/nuxt-countries-api">
								nuxt module
							</XamuActionLink>
							for faster responses.
						</b>
					</p>
					<p class="--txtSize-sm --txtColor-dark5">
						Currently we are hosted on
						<XamuActionLink href="https://render.com/">render</XamuActionLink>
						free tier, which spins downs with inactivity, delaying some responses up to
						50 secs.
					</p>
				</div>
				<hr />
				<div class="flx --flxColumn --flx-start">
					<div class="txt --gaping-5">
						<div class="flx --flxRow --flx-start-center">
							<h3>Countries</h3>
							<p class="--txtSize-sm --txtColor-dark5">Type&lt;Country[]&gt;</p>
						</div>
						<p>
							<b>
								Get all
								<XamuActionLink href="/api/v1">countries</XamuActionLink>
								. To get
								<XamuActionLink href="/api/v1?lang=es">translations</XamuActionLink>
								use the "lang" query.
							</b>
						</p>
						<p class="--txtColor-dark5">
							Supported translations are: kr, pt, nl, hr, fa, de, es, fr, ja, it, cn,
							tr.
						</p>
					</div>
					<div class="txt --gaping-10">
						<div class="flx --flxRow --flx-start-center">
							<h3>Country</h3>
							<p class="--txtSize-sm --txtColor-dark5">Type&lt;Country&gt;</p>
						</div>
						<div class="flx --flxColumn --flx-start --gap-5">
							<p>
								<b>
									Get a especific
									<XamuActionLink href="/api/v1/colombia">country</XamuActionLink>
									.
								</b>
							</p>
							<p class="--txtColor-dark5">
								The match could be made using the country iso2 code or any of the
								supported snake case name translations.
							</p>
						</div>
						<div class="flx --flxColumn --flx-start --gap-5">
							<p>
								<b>
									Include the states using the
									<XamuActionLink href="/api/v1/colombia?lang=es&states">
										"states"
									</XamuActionLink>
									query.
								</b>
							</p>
							<p class="--txtSize-sm --txtColor-dark5">
								Use the "cities" query to include the cities of each state as well,
								requires the "states" query.
							</p>
						</div>
					</div>
					<div class="txt --gaping-10">
						<div class="flx --flxColumn --flx-start --gap-5">
							<div class="flx --flxRow --flx-start-center">
								<h3>State</h3>
								<p class="--txtSize-sm --txtColor-dark5">Type&lt;State&gt;</p>
							</div>
							<p>
								<b>
									Get especific
									<XamuActionLink href="/api/v1/colombia/valle-del-cauca?lang=es">
										state
									</XamuActionLink>
									. Include the cities using the
									<XamuActionLink
										href="/api/v1/colombia/valle-del-cauca?lang=es&cities"
									>
										"cities"
									</XamuActionLink>
									query.
								</b>
							</p>
							<p class="--txtColor-dark5">
								The match could be made using the state iso2 code or the snake case
								name.
							</p>
						</div>
						<div class="flx --flxColumn --flx-start --gap-5">
							<p class="--txtSize-sm --txtColor-dark5">
								Use the "country" query to include the country as well.
							</p>
						</div>
					</div>
					<div class="txt --gaping-10">
						<div class="flx --flxColumn --flx-start --gap-5">
							<div class="flx --flxRow --flx-start-center">
								<h3>City</h3>
								<p class="--txtSize-sm --txtColor-dark5">Type&lt;City&gt;</p>
							</div>
							<p>
								<b>
									Get especific
									<XamuActionLink
										href="/api/v1/colombia/valle-del-cauca/cali?lang=es"
									>
										city
									</XamuActionLink>
									.
								</b>
							</p>
							<p class="--txtColor-dark5">
								The match could be made using the city snake case name.
							</p>
						</div>
						<div class="flx --flxColumn --flx-start --gap-5">
							<p class="--txtSize-sm --txtColor-dark5">
								Use the "state" query to include the state as well.
							</p>
							<p class="--txtSize-sm --txtColor-dark5">
								Use the "country" query to include the country as well.
							</p>
						</div>
					</div>
				</div>
				<hr />
				<div class="txt --gaping-5">
					<h3>About the project</h3>
					<p class="--txtSize-sm --txtColor-dark5">
						Source:
						<XamuActionLink href="https://github.com/vis97c/countries-api">
							@vis97c/countries-api
						</XamuActionLink>
						. Built with
						<XamuActionLink href="https://github.com/xamu-co/ui">
							Xamu UI
						</XamuActionLink>
						. Powered by
						<XamuActionLink href="https://nuxt.com/">Nuxt</XamuActionLink>
						.
					</p>
					<p class="--txtColor-dark5">
						This is an open source project, built and mantain by
						<XamuActionLink href="https://github.com/vis97c">@vis97c</XamuActionLink>
						. Feel free to use it on your projects or suggest improvements.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	// eslint-disable-next-line import/no-unresolved
	import { useHead } from "#imports";

	// lifecycle
	useHead({
		title: "Home ⋅ Countries api",
	});
</script>
