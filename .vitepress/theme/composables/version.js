export function useVersion() {
  const { theme } = useData();

  const currentVersion = ref();

  const versions = theme.value.versions;
  const defaultVersion = theme.value.defaults?.version;

  if (typeof window !== 'undefined') {
    currentVersion.value = localStorage.getItem('currentVersion') || defaultVersion;
  } else {
    currentVersion.value = defaultVersion;
  }

  const updateVersionFromPath = (path) => {
    const requestVersion = path.split('/')[1];

    if (versions.some((version) => version.text === requestVersion)) {
      currentVersion.value = requestVersion;
    } else {
      currentVersion.value = defaultVersion;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('currentVersion', currentVersion.value);
    }
  };

  return {
    currentVersion,
    updateVersionFromPath,
  };
}
