<template>
	<Body class="--minHeight-full flx --flxColumn --flx-center-stretch">
		<main id="appex" class="flx --flxColumn --flx-center-start --width-100">
			<NuxtPage />
		</main>
	</Body>
</template>

<style>
	body {
		overflow: visible;
		height: auto;
	}
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
	.avatar {
		border-radius: 0;
	}
	[id] {
		scroll-margin-top: 2rem;
	}
</style>
