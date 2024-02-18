<template>
	<Body class="--minHeight-full flx --flx-center">
		<main id="appex" class="flx --flxColumn --flx-center-start">
			<NuxtPage />
		</main>
	</Body>
</template>

<style>
	#appex {
		min-height: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.view {
		width: 100%;
	}
</style>
