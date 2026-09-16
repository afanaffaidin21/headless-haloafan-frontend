# CMS cache revalidation

The frontend keeps successful CMS collections in the Next.js Data Cache for
the duration configured by `NEXT_PUBLIC_REVALIDATE_SECONDS` (30 seconds by
default). To refresh the homepage and collection pages immediately after a
WordPress save, configure the CMS to call this endpoint:

```text
POST https://www.haloafan.com/api/revalidate/cms
Authorization: Bearer <CMS_REVALIDATE_SECRET>
Content-Type: application/json
```

Set the same random value in the frontend deployment as the server-only
environment variable `CMS_REVALIDATE_SECRET`. Do not use a `NEXT_PUBLIC_`
prefix for this secret.

The request body may include an optional scope. If the CMS webhook does not
send JSON or omits the scope, the endpoint refreshes all CMS collections:

```json
{"scope":"experiments"}
```

Supported scopes are `experiments`, `projects`, `blog`, and `all`. The endpoint
also accepts `postType`, `post_type`, or `type` for webhook payloads that use
WordPress-style field names.

The endpoint must be added to the CMS webhook configuration manually. After
deploying the frontend and setting the environment variable, send one test
request from the CMS or an equivalent server-side webhook tool. A successful
response has `revalidated: true`; the next page visit then reads the latest
CMS snapshot.

## WordPress setup

If the CMS already has an outgoing-webhook plugin, create one webhook for
published, updated, and trashed content. Limit it to the `experiment`,
`project`, and regular `post` post types, and use the URL, `Authorization`
header, and JSON body shown above. Set the body scope to `experiments` for
experiment saves, `projects` for project saves, or `blog` for regular posts.

If there is no webhook plugin, the same request can be sent from the
`haloafan-core` plugin. Keep the values in `wp-config.php`, outside the plugin
source:

```php
define( 'HALOAFAN_REVALIDATE_URL', 'https://www.haloafan.com/api/revalidate/cms' );
define( 'HALOAFAN_REVALIDATE_SECRET', 'same-value-as-the-frontend-secret' );
```

Then add this hook to the plugin:

```php
add_action( 'save_post', 'haloafan_notify_frontend_cache', 20, 3 );

function haloafan_notify_frontend_cache( $post_id, $post, $update ) {
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
        return;
    }

    if ( ! $post instanceof WP_Post ) {
        return;
    }

    $scopes = array(
        'experiment' => 'experiments',
        'project'    => 'projects',
        'post'       => 'blog',
    );

    if ( ! isset( $scopes[ $post->post_type ] ) ) {
        return;
    }

    if ( ! defined( 'HALOAFAN_REVALIDATE_URL' ) ||
        ! defined( 'HALOAFAN_REVALIDATE_SECRET' ) ) {
        return;
    }

    wp_remote_post(
        HALOAFAN_REVALIDATE_URL,
        array(
            'timeout'   => 5,
            'blocking'  => false,
            'sslverify' => true,
            'headers'   => array(
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . HALOAFAN_REVALIDATE_SECRET,
            ),
            'body'      => wp_json_encode(
                array(
                    'scope'   => $scopes[ $post->post_type ],
                    'postId'  => $post_id,
                    'postType' => $post->post_type,
                )
            ),
        )
    );
}
```

The post type names in the example are the usual singular WordPress names.
If `haloafan-core` registers different names, replace the keys in `$scopes`
with the values returned by `$post->post_type`.
