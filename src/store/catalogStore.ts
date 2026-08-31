import { create } from 'zustand';
import {
  servicesApi,
  vendorsApi,
  type ApiServiceListing,
  type ApiVendorListItem,
  type ApiVendorDetail,
  type ServiceListParams,
  type VendorListParams,
} from '../services/catalogApi';
import type { Pagination } from '../services/http';

type CatalogStore = {
  services: ApiServiceListing[];
  servicesPagination: Pagination | null;
  servicesLoading: boolean;
  vendors: ApiVendorListItem[];
  vendorsPagination: Pagination | null;
  vendorsLoading: boolean;
  error: string | null;

  loadServices: (params?: ServiceListParams) => Promise<void>;
  loadVendors: (params?: VendorListParams) => Promise<void>;
  getVendor: (id: string) => Promise<ApiVendorDetail>;
  getService: (id: string) => Promise<ApiServiceListing>;
};

export const useCatalogStore = create<CatalogStore>((set) => ({
  services: [],
  servicesPagination: null,
  servicesLoading: false,
  vendors: [],
  vendorsPagination: null,
  vendorsLoading: false,
  error: null,

  loadServices: async params => {
    set({ servicesLoading: true, error: null });
    try {
      const { items, pagination } = await servicesApi.list(params);
      set({ services: items, servicesPagination: pagination, servicesLoading: false });
    } catch (error) {
      set({ servicesLoading: false, error: (error as Error).message });
      throw error;
    }
  },

  loadVendors: async params => {
    set({ vendorsLoading: true, error: null });
    try {
      const { items, pagination } = await vendorsApi.list(params);
      set({ vendors: items, vendorsPagination: pagination, vendorsLoading: false });
    } catch (error) {
      set({ vendorsLoading: false, error: (error as Error).message });
      throw error;
    }
  },

  getVendor: id => vendorsApi.get(id),
  getService: id => servicesApi.get(id),
}));
