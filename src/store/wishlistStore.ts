import { create } from 'zustand';
import { wishlistApi, type ApiWishlistItem, type WishlistTarget } from '../services/wishlistApi';

type WishlistState = {
  productIds: Record<string, true>;
  serviceIds: Record<string, true>;
  items: ApiWishlistItem[];
  itemsLoading: boolean;
  error: string | null;
  loadIds: () => Promise<void>;
  loadItems: () => Promise<ApiWishlistItem[]>;
  /** Saves or unsaves; flips the heart immediately and rolls back on failure. */
  toggle: (target: WishlistTarget) => Promise<boolean>;
  remove: (item: ApiWishlistItem) => Promise<void>;
  reset: () => void;
};

const toMap = (ids: string[] = []) =>
  ids.reduce<Record<string, true>>((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});

const withKey = (map: Record<string, true>, id: string, on: boolean) => {
  const next = { ...map };
  if (on) next[id] = true;
  else delete next[id];
  return next;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: {},
  serviceIds: {},
  items: [],
  itemsLoading: false,
  error: null,

  loadIds: async () => {
    const data = await wishlistApi.ids();
    set({ productIds: toMap(data?.productIds), serviceIds: toMap(data?.serviceIds) });
  },

  loadItems: async () => {
    set({ itemsLoading: true, error: null });
    try {
      const data = await wishlistApi.list();
      const items = data?.items ?? [];
      set({
        items,
        itemsLoading: false,
        productIds: toMap(items.map(i => i.productId).filter(Boolean) as string[]),
        serviceIds: toMap(items.map(i => i.serviceId).filter(Boolean) as string[]),
      });
      return items;
    } catch (err) {
      set({ itemsLoading: false, error: (err as Error).message });
      throw err;
    }
  },

  toggle: async target => {
    const isProduct = 'productId' in target;
    const id = isProduct ? target.productId : target.serviceId;
    const key = isProduct ? 'productIds' : 'serviceIds';
    const wasSaved = Boolean(get()[key][id]);
    set(state => ({ [key]: withKey(state[key], id, !wasSaved) }) as Partial<WishlistState>);
    try {
      if (wasSaved) {
        await wishlistApi.removeByTarget(target);
        set(state => ({
          items: state.items.filter(i => (isProduct ? i.productId : i.serviceId) !== id),
        }));
      } else {
        await wishlistApi.add(target);
      }
      return !wasSaved;
    } catch (err) {
      set(state => ({ [key]: withKey(state[key], id, wasSaved) }) as Partial<WishlistState>);
      throw err;
    }
  },

  remove: async item => {
    const prev = get().items;
    set(state => ({
      items: state.items.filter(i => i.id !== item.id),
      productIds: item.productId ? withKey(state.productIds, item.productId, false) : state.productIds,
      serviceIds: item.serviceId ? withKey(state.serviceIds, item.serviceId, false) : state.serviceIds,
    }));
    try {
      await wishlistApi.remove(item.id);
    } catch (err) {
      set(state => ({
        items: prev,
        productIds: item.productId ? withKey(state.productIds, item.productId, true) : state.productIds,
        serviceIds: item.serviceId ? withKey(state.serviceIds, item.serviceId, true) : state.serviceIds,
      }));
      throw err;
    }
  },

  reset: () => set({ productIds: {}, serviceIds: {}, items: [], error: null }),
}));
