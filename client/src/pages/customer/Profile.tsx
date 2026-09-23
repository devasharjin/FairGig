import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Briefcase,
  Grid,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  User,
  LogIn,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import {
  useCustomerProfile,
  useUpdateCustomerProfile,
  useUpdateCustomerAddress,
  useAddSavedAddress,
  useUpdateSavedAddress,
  useDeleteSavedAddress,
  useSetDefaultAddress,
} from "@/features/customer/profile/hooks";
import type {
  AddressFormData,
  SavedAddress,
  CustomerAddress,
} from "@/features/customer/profile/types";
import {
  CustomerProfileHeader,
  CustomerProfileStats,
  CustomerDetailsCard,
  CustomerAddressesCard,
  EditCustomerDetailsDialog,
  EditCustomerAddressDialog,
} from "@/components/customer/profile";
import { Button } from "@/components/ui/button";

export const CustomerProfile: React.FC = () => {
  const { t } = useTranslation();
  const authUser = useAuthStore((state) => state.user);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);

  // TanStack Query: Fetch Customer Profile data & metrics
  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useCustomerProfile();

  // Mutations
  const updateProfileMutation = useUpdateCustomerProfile();
  const updatePrimaryAddressMutation = useUpdateCustomerAddress();
  const addAddressMutation = useAddSavedAddress();
  const updateSavedAddressMutation = useUpdateSavedAddress();
  const deleteAddressMutation = useDeleteSavedAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

  // Dialog States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [addressDialog, setAddressDialog] = useState<{
    open: boolean;
    mode: "add" | "edit-saved" | "edit-primary";
    address: SavedAddress | CustomerAddress | null;
  }>({
    open: false,
    mode: "add",
    address: null,
  });

  const currentUser = profileData?.user || authUser;
  const currentAddress = profileData?.address || null;
  const savedAddresses = profileData?.savedAddresses || [];
  const stats = profileData?.stats;

  // Handlers for Profile Dialog
  const handleSaveProfile = async (data: { name: string; phone: string }) => {
    await updateProfileMutation.mutateAsync(data);
    setIsEditProfileOpen(false);
  };

  // Handlers for Address Dialog
  const handleOpenAddAddress = () => {
    setAddressDialog({
      open: true,
      mode: "add",
      address: null,
    });
  };

  const handleOpenEditPrimary = () => {
    setAddressDialog({
      open: true,
      mode: "edit-primary",
      address: currentAddress,
    });
  };

  const handleOpenEditSaved = (address: SavedAddress) => {
    setAddressDialog({
      open: true,
      mode: "edit-saved",
      address,
    });
  };

  const handleSaveAddress = async (formData: AddressFormData) => {
    if (addressDialog.mode === "add") {
      await addAddressMutation.mutateAsync(formData);
    } else if (addressDialog.mode === "edit-primary") {
      await updatePrimaryAddressMutation.mutateAsync({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        landmark: formData.landmark,
      });
    } else if (
      addressDialog.mode === "edit-saved" &&
      addressDialog.address &&
      "_id" in addressDialog.address
    ) {
      await updateSavedAddressMutation.mutateAsync({
        addressId: (addressDialog.address as SavedAddress)._id,
        payload: formData,
      });
    }
    setAddressDialog((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm(t("profile.confirmDeleteAddress"))) {
      deleteAddressMutation.mutate(addressId);
    }
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddressMutation.mutate(addressId);
  };

  // If customer is not authenticated, show friendly sign-in prompt
  if (isBootstrapped && !authUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-border/80 bg-card shadow-xs">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <User className="size-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {t("profile.accountRequired")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t("profile.accountRequiredDesc")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-xl px-5 gap-2 text-xs font-semibold shadow-xs bg-primary text-primary-foreground">
                <LogIn className="size-3.5" />
                <span>{t("profile.login")}</span>
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl px-5 gap-2 text-xs font-semibold">
                <span>{t("profile.createAccount")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Skeleton Loading State
  if (isLoading && !profileData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 animate-pulse">
        <div className="h-44 rounded-3xl bg-muted/60" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 rounded-3xl bg-muted/60" />
          <div className="h-24 rounded-3xl bg-muted/60" />
          <div className="h-24 rounded-3xl bg-muted/60" />
          <div className="h-24 rounded-3xl bg-muted/60" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-80 rounded-3xl bg-muted/60" />
          <div className="lg:col-span-2 h-80 rounded-3xl bg-muted/60" />
        </div>
      </div>
    );
  }

  // Error State with retry
  if (isError && !profileData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <ShieldCheck className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {t("profile.loadError")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("profile.loadErrorDesc")}
        </p>
        <Button
          onClick={() => refetch()}
          className="rounded-xl text-xs font-semibold gap-2 cursor-pointer"
        >
          <RefreshCw className="size-3.5" />
          <span>{t("profile.retry")}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-20">
      {/* 1. Header Hero Banner */}
      <CustomerProfileHeader
        user={currentUser}
        address={currentAddress}
        onOpenEdit={() => setIsEditProfileOpen(true)}
      />

      {/* 2. Order & Activity Metrics */}
      <CustomerProfileStats stats={stats} />

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Information & Quick Services Card */}
        <div className="lg:col-span-1 space-y-6">
          <CustomerDetailsCard
            user={currentUser}
            onOpenEdit={() => setIsEditProfileOpen(true)}
          />

          {/* Quick Actions Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              {t("profile.customerHub", { defaultValue: t("profile.hub.title") })}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("profile.customerHubDesc", { defaultValue: t("profile.hub.desc") })}
            </p>

            <div className="space-y-2 pt-1">
              <Link to="/bookings" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl h-10 px-3.5 text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="size-3.5 text-primary" />
                    <span>{t("profile.myBookings", { defaultValue: t("profile.hub.myBookings") })}</span>
                  </span>
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                </Button>
              </Link>

              <Link to="/services" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl h-10 px-3.5 text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Grid className="size-3.5 text-primary" />
                    <span>{t("profile.browseAllServices", { defaultValue: t("profile.hub.browseServices") })}</span>
                  </span>
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Cooperative Guarantee Note */}
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xs flex items-start gap-3">
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="size-4" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-emerald-950 dark:text-emerald-200">
                {t("profile.fairWageTitle", { defaultValue: t("profile.hub.fairWageTitle") })}
              </p>
              <p className="text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed text-[11px]">
                {t("profile.fairWageDesc", { defaultValue: t("profile.hub.fairWageDesc") })}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Address Details & Locations Card */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerAddressesCard
            primaryAddress={currentAddress}
            savedAddresses={savedAddresses}
            onAddNewAddress={handleOpenAddAddress}
            onEditPrimary={handleOpenEditPrimary}
            onEditAddress={handleOpenEditSaved}
            onDeleteAddress={handleDeleteAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            isSettingDefault={setDefaultAddressMutation.isPending}
            isDeleting={deleteAddressMutation.isPending}
          />
        </div>
      </div>

      {/* 4. Dialogs */}
      <EditCustomerDetailsDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        initialData={currentUser}
        onSubmit={handleSaveProfile}
        isPending={updateProfileMutation.isPending}
      />

      <EditCustomerAddressDialog
        open={addressDialog.open}
        onOpenChange={(open) => setAddressDialog((prev) => ({ ...prev, open }))}
        mode={addressDialog.mode}
        initialData={addressDialog.address}
        onSubmit={handleSaveAddress}
        isPending={
          addAddressMutation.isPending ||
          updatePrimaryAddressMutation.isPending ||
          updateSavedAddressMutation.isPending
        }
      />
    </div>
  );
};

export default CustomerProfile;
