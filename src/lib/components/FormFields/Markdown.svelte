<script lang="ts">
	import { makeDefaultController, type FormField, type FieldController, type FormFieldProps } from '.';
	import { Markdown } from '../Icons';
	import BaseField from './BaseField.svelte';

	interface $$Props extends FormFieldProps {};

	export let definition: FormField;
	export let value: unknown = undefined;
	export let controller: FieldController<unknown> = makeDefaultController(definition, value);

	const { name, label } = definition;
</script>

<BaseField {definition} bind:value {controller} let:validationState let:helpText>
	<div>
		<textarea
			{name}
			class="textarea"
			id="input-{name}"
			aria-label={label}
			rows={3}
			bind:value={$controller.value}
		/>
		<Markdown size="small" class="float-right" />
	</div>
</BaseField>
