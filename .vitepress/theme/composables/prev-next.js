import { getFlatSideBarLinks } from '@/support/sidebar.js';

export function usePrevNext() {
  const { page, theme } = useData();

  const activeMenu = computed(() => {
    let menu = page.value.filePath.split('/')[0];
    return `/${menu}/`;
  });

  const sidebar = computed(() => {
    // Safely access sidebar using activeMenu.value
    return theme.value.sidebar[activeMenu.value] || [];
  });

  const cleanText = (text) => text.replace(/^- /, '');

  return computed(() => {
    // Ensure sidebar.value is defined before calling getFlatSideBarLinks
    const candidates = sidebar.value ? getFlatSideBarLinks(sidebar.value) : [];

    const index = candidates.findIndex((link) => {
      return isActive(page.value.relativePath, link.link);
    });

    const prev =
      index > 0 ? { text: cleanText(candidates[index - 1].text), link: candidates[index - 1].link } : undefined;
    const next =
      index >= 0 && index < candidates.length - 1
        ? { text: cleanText(candidates[index + 1].text), link: candidates[index + 1].link }
        : undefined;

    return { prev, next };
  });
}
