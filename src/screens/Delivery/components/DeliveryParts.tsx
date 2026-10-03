import React, { useState } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import Price from '../../../components/ui/Price';
import type { Delivery, DeliveryOffer, DeliveryRider, DeliveryStatus } from '../../../services/deliveryApi';
import {
  DELIVERY_STATUS_META,
  TRACKING_STEPS,
  VEHICLE_META,
  deliveryMapUrl,
  formatClock,
  trackingIndex,
} from '../deliveryMeta';
import { deliveryStyles as styles } from '../styles';

export function StatusPill({ status }: { status: DeliveryStatus }) {
  const meta = DELIVERY_STATUS_META[status] ?? DELIVERY_STATUS_META.open;
  return (
    <View style={[styles.statusPill, { backgroundColor: meta.bg }]} testID={`delivery-status-${status}`}>
      <Icon name={meta.icon} size={13} color={meta.color} />
      <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

export function Banner({
  tone,
  icon,
  title,
  text,
  testID,
}: {
  tone: 'danger' | 'warning' | 'info' | 'success';
  icon: string;
  title: string;
  text?: string;
  testID?: string;
}) {
  const palette = {
    danger: { bg: colors.errorLight, border: '#FECACA', fg: colors.errorDeep },
    warning: { bg: colors.amberBg, border: colors.amberBorder, fg: colors.amberText },
    info: { bg: colors.infoLight, border: '#BFDBFE', fg: colors.primaryDark },
    success: { bg: colors.successLight, border: '#A7F3D0', fg: colors.successDeep },
  }[tone];
  return (
    <View style={[styles.banner, { backgroundColor: palette.bg, borderColor: palette.border }]} testID={testID}>
      <Icon name={icon} size={20} color={palette.fg} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.bannerTitle, { color: palette.fg }]}>{title}</Text>
        {text ? <Text style={[styles.bannerText, { color: palette.fg }]}>{text}</Text> : null}
      </View>
    </View>
  );
}

export function RouteCard({ delivery }: { delivery: Delivery }) {
  return (
    <View style={styles.card}>
      <View style={styles.stopRow}>
        <View style={[styles.stopBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.stopBadgeText}>A</Text>
        </View>
        <View style={styles.stopBody}>
          <Text style={styles.stopTitle}>{delivery.pickup.label || 'Pickup'}</Text>
          <Text style={styles.stopLine}>{delivery.pickup.address}</Text>
        </View>
      </View>
      <View style={styles.stopConnector} />
      <View style={styles.stopRow}>
        <View style={[styles.stopBadge, { backgroundColor: colors.success }]}>
          <Text style={styles.stopBadgeText}>B</Text>
        </View>
        <View style={styles.stopBody}>
          <Text style={styles.stopTitle}>{delivery.recipient.name || delivery.dropoff.label || 'Drop-off'}</Text>
          <Text style={styles.stopLine}>{delivery.dropoff.address}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 12 }}>
        {delivery.distanceKm != null ? <Meta icon="resize-outline" text={`${delivery.distanceKm} km`} /> : null}
        {delivery.parcel ? <Meta icon="cube-outline" text={delivery.parcel} /> : null}
        {delivery.scheduledPickupAt ? (
          <Meta
            icon="calendar-outline"
            text={`Pickup ${new Date(delivery.scheduledPickupAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}, ${formatClock(delivery.scheduledPickupAt)}`}
          />
        ) : (
          <Meta icon="flash-outline" text="ASAP pickup" />
        )}
      </View>
      {delivery.notes ? <Text style={[styles.muted, { marginTop: 8 }]}>“{delivery.notes}”</Text> : null}
    </View>
  );
}

function Meta({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.offerMetaItem}>
      <Icon name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.offerMetaText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

export function RiderAvatar({ rider }: { rider: DeliveryRider | null }) {
  const initials = (rider?.fullName || 'R')
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View style={styles.avatar}>
      {rider?.image ? (
        <Image source={{ uri: rider.image }} style={styles.avatarImg} />
      ) : (
        <Text style={styles.avatarInitials}>{initials}</Text>
      )}
    </View>
  );
}

export function RiderStats({ rider, eta }: { rider: DeliveryRider | null; eta?: number | null }) {
  const vehicle = rider?.vehicle ? VEHICLE_META[rider.vehicle] : null;
  return (
    <View style={styles.offerMeta}>
      <View style={styles.offerMetaItem}>
        <Icon name="star" size={13} color={colors.star} />
        <Text style={styles.offerMetaText}>
          {rider?.rating ? rider.rating.toFixed(1) : 'New'}
          {rider?.ratingCount ? ` (${rider.ratingCount})` : ''}
        </Text>
      </View>
      {vehicle ? (
        <View style={styles.offerMetaItem}>
          <Icon name={vehicle.icon} size={13} color={colors.textMuted} />
          <Text style={styles.offerMetaText}>{vehicle.label}</Text>
        </View>
      ) : null}
      {eta != null ? (
        <View style={styles.offerMetaItem}>
          <Icon name="time-outline" size={13} color={colors.textMuted} />
          <Text style={styles.offerMetaText}>{eta} min to pickup</Text>
        </View>
      ) : null}
      <View style={styles.offerMetaItem}>
        <Icon name="checkmark-done-outline" size={13} color={colors.textMuted} />
        <Text style={styles.offerMetaText}>{rider?.completed ?? 0} deliveries</Text>
      </View>
    </View>
  );
}

export function OfferCard({
  offer,
  currency,
  proposedFare,
  selected,
  onSelect,
  busy,
  index,
}: {
  offer: DeliveryOffer;
  currency: string;
  proposedFare: number | null;
  selected: boolean;
  onSelect?: () => void;
  busy?: boolean;
  index: number;
}) {
  const isCounter = offer.kind === 'counter';
  return (
    <View style={[styles.offerCard, selected && styles.offerCardSelected]} testID={`offer-${index}`}>
      <View style={styles.offerHead}>
        <RiderAvatar rider={offer.rider} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.offerName} numberOfLines={1}>
            {offer.rider?.fullName ?? 'Rider'}
          </Text>
          <RiderStats rider={offer.rider} eta={offer.etaMinutes} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Price amount={offer.amount} currency={currency} style={styles.offerPrice} align="right" />
          <Text style={[styles.offerKind, { color: isCounter ? colors.amberTextMid : colors.success }]}>
            {!isCounter
              ? 'Accepted your fare'
              : proposedFare != null && offer.amount != null && offer.amount < proposedFare
                ? 'Counter · below your fare'
                : 'Counter-offer'}
          </Text>
        </View>
      </View>
      {onSelect ? (
        <TouchableOpacity
          testID={`offer-select-${index}`}
          style={[styles.outlineBtn, selected && { backgroundColor: colors.primary }]}
          onPress={onSelect}
          disabled={busy}
          activeOpacity={0.85}
        >
          <Text style={[styles.outlineBtnText, selected && { color: colors.white }]}>
            {selected ? 'Selected' : 'Choose this rider'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function DeliveryMap({ delivery }: { delivery: Delivery }) {
  const [failed, setFailed] = useState(false);
  const url = deliveryMapUrl(delivery);
  const openMaps = () => {
    const d = delivery;
    if (d.pickup.lat == null || d.dropoff.lat == null) return;
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&origin=${d.pickup.lat},${d.pickup.lng}&destination=${d.dropoff.lat},${d.dropoff.lng}`,
    ).catch(() => {});
  };
  return (
    <TouchableOpacity style={styles.mapWrap} activeOpacity={0.95} onPress={openMaps} testID="delivery-map">
      {url && !failed ? (
        <Image source={{ uri: url }} style={styles.map} resizeMode="cover" onError={() => setFailed(true)} />
      ) : (
        <View style={styles.mapFallback}>
          <Icon name="map-outline" size={28} color={colors.primary} />
          <Text style={styles.muted}>Map unavailable</Text>
        </View>
      )}
      <View style={styles.mapLegend}>
        <Legend color={colors.primary} text="A Pickup" />
        <Legend color={colors.success} text="B Drop-off" />
        {delivery.riderLocation ? <Legend color={colors.warning} text="R Rider" /> : null}
      </View>
    </TouchableOpacity>
  );
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{text}</Text>
    </View>
  );
}

export function Timeline({ delivery }: { delivery: Delivery }) {
  const current = trackingIndex(delivery);
  return (
    <View style={styles.card} testID="delivery-timeline">
      <Text style={styles.cardTitle}>Progress</Text>
      {TRACKING_STEPS.map((step, i) => {
        const done = i <= current;
        const isLast = i === TRACKING_STEPS.length - 1;
        const at = delivery.timestamps[step.stamp];
        return (
          <View key={step.status} style={styles.stepRow}>
            <View style={styles.stepRail}>
              <View
                style={[
                  styles.stepDot,
                  {
                    borderColor: done ? colors.primary : colors.border,
                    backgroundColor: done ? colors.primary : colors.white,
                  },
                ]}
              >
                {done ? <Icon name="checkmark" size={12} color={colors.white} /> : null}
              </View>
              {!isLast ? (
                <View style={[styles.stepLine, { backgroundColor: i < current ? colors.primary : colors.border }]} />
              ) : null}
            </View>
            <View style={styles.stepBody}>
              <Text style={[styles.stepLabel, { color: done ? colors.text : colors.textFaint }]}>{step.label}</Text>
              {at ? <Text style={styles.stepTime}>{formatClock(at)}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function Stars({
  value,
  onChange,
  size = 34,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map(n => (
        <TouchableOpacity key={n} testID={`star-${n}`} disabled={!onChange} onPress={() => onChange?.(n)} hitSlop={4}>
          <Icon name={n <= value ? 'star' : 'star-outline'} size={size} color={n <= value ? colors.star : colors.starEmpty} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
