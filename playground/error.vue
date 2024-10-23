<template>
	<div id="error" class="view">
		<section class="view-item --bgColor">
			<div class="holder">
				<div class="flx --flxColumn --flx-center">
					<div class="txt --txtAlignFlx-center --gap">
						<h1 class="--txtSize-mx">{{ error.statusCode }}</h1>
						<h4>{{ errorMessage }}.</h4>
						<template v-if="error.statusCode >= 500 && error.statusCode <= 599">
							<p>You can try:</p>
							<div class="flx --flxRow-wrap --flx-center">
								<XamuActionLink rel="noopener" @click="reload">
									<span>Retry</span>
								</XamuActionLink>
							</div>
						</template>
						<XamuActionLink v-else rel="noopener" @click="clearError({ redirect: '/' })">
							Back home
						</XamuActionLink>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	// eslint-disable-next-line import/no-unresolved
	import { computed, useHead, clearError } from "#imports";

	const props = defineProps({
		error: {
			type: Object,
			required: true,
		},
	});

	const errorMessage = computed<string>(() => {
		switch (props.error.statusCode) {
			case 404:
				return "The page you are looking for is wrong or doesn't exist";
			case 503:
				return "Internal server error";
			default:
				return props.error.message;
		}
	});

	function reload() {
		location.reload();
	}

	// lifecycle
	useHead(() => ({
		title: `${props.error.statusCode} ⋅ Countries api`,
	}));
</script>

<style scoped>
	@media only screen {
		#error .view-item {
			min-height: 100dvh;
		}
	}
</style>
