<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';
	import { makeDefaultController, type FormField, type FieldController, type FormFieldProps } from '.';
	import BaseField from './BaseField.svelte';

	interface $$Props extends FormFieldProps {};

	export let definition: FormField;
	export let value: unknown = undefined;
	export let controller: FieldController<unknown> = makeDefaultController(definition, value);

	const { name, required, attributes } = definition;
	const typedController = controller as FieldController<string[]>;
</script>

<BaseField {definition} bind:value {controller} hideHelp let:validationState let:helpText>
	<InputChip
		bind:value={$typedController.value}
		name={name}
		placeholder="Enter any value..."
		class={`${validationState === 'invalid' ? 'input-error' : ''}`}
		id="input-{name}"
		aria-describedby={`description-${name}`}
		required={required ? true : false}
		allowDuplicates={attributes?.duplicates ? true : false}
		allowUpperCase={attributes?.lowercase ? false : true}
	/>
	<p id={`description-${name}`} class="opacity-50">
		{#if helpText}
		{helpText}
		{:else}
		Press <kbd class="kbd">ENTER</kbd> to save each item
		{/if}
	</p>
</BaseField>