import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WindowState } from '../types';

export interface UseURLSyncReturn {
  getPopupsFromURL: () => string[];
  updateURL: (popupIds: string[]) => void;
  openPopupWithURL: (popupId: string, openPopupFn: (id: string) => void) => void;
  closePopupWithURL: (popupId: string, closePopupFn: (id: string) => void) => void;
}

export function useURLSync(
  openPopups: WindowState[],
  addPopupFromURL: (popupId: string, zIndex: number) => void,
  getMaxPopupZ: () => number
): UseURLSyncReturn {
  const location = useLocation();
  const navigate = useNavigate();

  const getPopupsFromURL = useCallback((): string[] => {
    const params = new URLSearchParams(location.search);
    const open = params.get('open');
    return open ? open.split(',') : [];
  }, [location.search]);

  const updateURL = useCallback((popupIds: string[]) => {
    const params = new URLSearchParams();
    if (popupIds.length) {
      params.set('open', popupIds.join(','));
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [navigate]);

  // Sync URL -> state
  useEffect(() => {
    const urlPopups = getPopupsFromURL();
    const currentIds = new Set(openPopups.map(p => p.id));
    const newIds = urlPopups.filter(id => !currentIds.has(id));

    if (newIds.length) {
      const maxZ = getMaxPopupZ();
      newIds.forEach((id, i) => {
        addPopupFromURL(id, maxZ + i + 1);
      });
    }
  }, [location.search, openPopups, getPopupsFromURL, addPopupFromURL, getMaxPopupZ]);

  const openPopupWithURL = useCallback((
    popupId: string,
    openPopupFn: (id: string) => void
  ) => {
    openPopupFn(popupId);
    const urlPopups = getPopupsFromURL();
    if (!urlPopups.includes(popupId)) {
      updateURL([...urlPopups, popupId]);
    }
  }, [getPopupsFromURL, updateURL]);

  const closePopupWithURL = useCallback((
    popupId: string,
    closePopupFn: (id: string) => void
  ) => {
    closePopupFn(popupId);
    updateURL(getPopupsFromURL().filter(id => id !== popupId));
  }, [getPopupsFromURL, updateURL]);

  return {
    getPopupsFromURL,
    updateURL,
    openPopupWithURL,
    closePopupWithURL
  };
}
