<script setup>
  const { theme } = useData();
  const router = useRouter();

  const version = theme.value.defaults?.version;

  router.go(`/${version}/`);
</script>
