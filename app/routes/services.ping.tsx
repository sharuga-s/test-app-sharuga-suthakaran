// TODO: Add your health checks here
const healthChecks: (() => {})[] = [];

export async function loader() {
  for (const healthCheck of healthChecks) {
    const healthy = healthCheck();
    if (!healthy) {
      return new Response(null, {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }
  }

  const test_env_var = process.env.KOTT_TEST_ENV_VAR;
  console.log(`KOTT_TEST_ENV_VAR output: ${test_env_var}`);

  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
