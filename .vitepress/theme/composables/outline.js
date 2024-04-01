import { throttleAndDebounce } from '@/support/utils.js';

const PAGE_OFFSET = 40;

export function getHeaders(range = [1, 6]) {
  if (typeof document === 'undefined') {
    return [];
  }

  const headers = [...document.querySelectorAll('.prose h2,h3,h4,h5,h6')]
    .filter((el) => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1]);
      return {
        title: serializeHeader(el),
        link: '#' + el.id,
        level,
      };
    });

  return resolveHeaders(headers, range);
}

function serializeHeader(h) {
  let ret = '';
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (node.classList.contains('VPBadge') || node.classList.contains('header-anchor')) {
        continue;
      }
      ret += node.textContent;
    } else if (node.nodeType === 3) {
      ret += node.textContent;
    }
  }
  return ret.trim();
}

export function resolveHeaders(headers, range = [2, 6]) {
  if (range === false) {
    return [];
  }

  let levelsRange = Array.isArray(range) ? range : [2, 6];
  const [high, low] = levelsRange;

  headers = headers.filter((h) => h.level >= high && h.level <= low);

  const ret = [];

  outer: for (let i = 0; i < headers.length; i++) {
    const cur = headers[i];
    if (i === 0) {
      ret.push(cur);
    } else {
      for (let j = i - 1; j >= 0; j--) {
        const prev = headers[j];
        if (prev.level < cur.level) {
          (prev.children || (prev.children = [])).push(cur);
          continue outer;
        }
      }
      ret.push(cur);
    }
  }

  return ret;
}

export const HASH_RE = /#.*$/;
export const EXT_RE = /(index)?\.(md|html)$/;

export function isActive(currentPath, matchPath) {
  currentPath = normalize(`/${currentPath}`);
  return normalize(matchPath) === currentPath;
}

function normalize(path) {
  return decodeURI(path).replace(HASH_RE, '').replace(EXT_RE, '');
}

export function useActiveAnchor(container) {
  const onScroll = throttleAndDebounce(setActiveLink, 100);

  let prevActiveLink = null;

  onMounted(() => {
    requestAnimationFrame(setActiveLink);
    window.addEventListener('scroll', onScroll);
  });

  onUpdated(() => {
    activateLink(location.hash);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
  });

  function setActiveLink() {
    const links = [].slice.call(container.value.querySelectorAll('.outline-link'));
    const anchors = [].slice.call(document.querySelectorAll('.prose .header-anchor')).filter((anchor) => {
      return links.some((link) => {
        return link.hash === anchor.hash && anchor.offsetParent !== null;
      });
    });

    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;
    const isTop = scrollY <= PAGE_OFFSET; // Check if near the top

    if (isTop) {
      clearActiveLink(); // Clear active link if at the top
      return;
    }

    if (anchors.length && isBottom) {
      activateLink(anchors[anchors.length - 1].hash);
      return;
    }

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      const nextAnchor = anchors[i + 1];
      const [isActive, hash] = isAnchorActive(i, anchor, nextAnchor);

      if (isActive) {
        activateLink(hash);
        return;
      }
    }
  }

  function clearActiveLink() {
    if (prevActiveLink) {
      prevActiveLink.classList.remove('!text-primary-500');
      prevActiveLink.classList.remove('!border-primary-500');
      prevActiveLink = null;
    }
  }

  function activateLink(hash) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove('!text-primary-500');
      prevActiveLink.classList.remove('!border-primary-500');
    }

    if (hash !== null) {
      prevActiveLink = container.value.querySelector(`a[href="${decodeURIComponent(hash)}"]`);
    }

    const activeLink = prevActiveLink;

    if (activeLink) {
      activeLink.classList.add('!text-primary-500');
      activeLink.classList.add('!border-primary-500');
    }
  }
}

function getAnchorTop(anchor) {
  return anchor.parentElement.offsetTop - PAGE_OFFSET;
}

function isAnchorActive(index, anchor, nextAnchor) {
  const scrollTop = window.scrollY;

  if (scrollTop < getAnchorTop(anchor)) {
    return [false, null];
  }

  if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) {
    return [true, anchor.hash];
  }

  return [false, null];
}
