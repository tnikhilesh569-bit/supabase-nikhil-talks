// Bookmarking / Saved Posts management utility for Nikhil Talks
const BOOKMARKS_KEY = 'nikhil_talks_saved_posts_v1';

export function getBookmarkedIds(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isPostBookmarked(id: string): boolean {
  const ids = getBookmarkedIds();
  return ids.includes(id);
}

export function togglePostBookmark(id: string): boolean {
  try {
    const ids = getBookmarkedIds();
    let updated: string[];
    let isNowSaved = false;

    if (ids.includes(id)) {
      updated = ids.filter(item => item !== id);
      isNowSaved = false;
    } else {
      updated = [id, ...ids];
      isNowSaved = true;
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('bookmarks_updated'));
    return isNowSaved;
  } catch {
    return false;
  }
}

export function getBookmarks(): string[] {
  return getBookmarkedIds();
}

export function toggleBookmark(id: string): string[] {
  try {
    const ids = getBookmarkedIds();
    let updated: string[];

    if (ids.includes(id)) {
      updated = ids.filter(item => item !== id);
    } else {
      updated = [id, ...ids];
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('bookmarks_updated'));
    return updated;
  } catch {
    return getBookmarkedIds();
  }
}
