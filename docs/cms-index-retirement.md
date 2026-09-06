# Experiment Index retirement

The frontend no longer queries or requires `experimentFields.index`. Homepage
numbers come from list position; experiment detail labels use taxonomy terms.
The experiment list uses the `development` and `design` terms from
`kategori-experiment`.

The live CMS plugin `haloafan-core/haloafan-core.php` (version 1.0.2) was updated
through the WordPress plugin editor to remove the Index input from the editor:

```php
// Retire the manual experiment Index from the CMS editor.
// Keep its registration and stored values for older GraphQL clients until migration completes.
add_filter( 'acf/prepare_field/key=field_hf_exp_index', '__return_false' );
```

This filter sits after the `acf/init` registration. Preserve it when updating
the plugin from its source repository or ZIP. The complete plugin is maintained
outside this frontend repository.

The field definition and stored values remain available to old GraphQL clients.
Remove the registration and this filter only after the updated frontend has
been deployed and no clients query Index. Existing stored values need not be
deleted.

Verification: Index is absent from the experiment editor, while GraphQL still
returns the existing Index values and project data without errors.
