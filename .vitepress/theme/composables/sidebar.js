export function useSidebarControl(item) {
  const { page, site } = useData();

  const isActiveLink = computed(() => {
    return isActive(site.value.base.replace('/', '') + page.value.relativePath, item.value.link);
  });

  return {
    isActiveLink,
  };
}
