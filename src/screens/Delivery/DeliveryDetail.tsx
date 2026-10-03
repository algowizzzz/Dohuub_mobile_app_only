import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStripe } from '@stripe/stripe-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import Price from '../../components/ui/Price';
import { colors } from '../../styles';
import { ENV } from '../../config/env';
import { ApiError } from '../../services/ApiError';
import { deliveryApi, type Delivery, type DeliveryOffer } from '../../services/deliveryApi';
import {
  LIVE_STATUSES,
  PENDING_STATUSES,
  formatCountdown,
  formatDateTime,
  isUnfinished,
} from './deliveryMeta';
import {
  Banner,
  DeliveryMap,
  OfferCard,
  RiderAvatar,
  RiderStats,
  RouteCard,
  Stars,
  StatusPill,
  Timeline,
} from './components/DeliveryParts';
import { deliveryStyles as styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryDetail'>;

const POLL_MS = 5000;

type SortKey = 'price' | 'rating' | 'eta' | 'experience';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'price', label: 'Lowest fare' },
  { key: 'rating', label: 'Top rated' },
  { key: 'eta', label: 'Closest' },
  { key: 'experience', label: 'Most trips' },
];

function sortOffers(offers: DeliveryOffer[], key: SortKey) {
  const list = offers.filter(o => o.kind !== 'decline');
  const by: Record<SortKey, (a: DeliveryOffer, b: DeliveryOffer) => number> = {
    price: (a, b) => (a.amount ?? Infinity) - (b.amount ?? Infinity),
    rating: (a, b) => (b.rider?.rating ?? 0) - (a.rider?.rating ?? 0),
    eta: (a, b) => (a.etaMinutes ?? Infinity) - (b.etaMinutes ?? Infinity),
    experience: (a, b) => (b.rider?.completed ?? 0) - (a.rider?.completed ?? 0),
  };
  return [...list].sort(by[key]);
}

const PROBLEM_REASONS = [
  'Rider is not moving',
  'Rider asked for more money',
  'Parcel damaged',
  'Parcel not delivered',
  'Something else',
];

export default function DeliveryDetailScreen({ navigation, route }: Props) {
  const { deliveryId } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(Date.now());

  const [sort, setSort] = useState<SortKey>('price');
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [testPaid, setTestPaid] = useState(false);

  const [cancelVisible, setCancelVisible] = useState(false);
  const [problemVisible, setProblemVisible] = useState(false);
  const [problemReason, setProblemReason] = useState(PROBLEM_REASONS[0]);
  const [problemDetails, setProblemDetails] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [repostFare, setRepostFare] = useState('');

  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const fetchDelivery = useCallback(async () => {
    const d = await deliveryApi.get(deliveryId);
    if (mounted.current) {
      setDelivery(d);
      setLoadError(null);
    }
    return d;
  }, [deliveryId]);

  const initialLoad = useCallback(() => {
    setLoading(true);
    fetchDelivery()
      .catch(err => mounted.current && setLoadError(ApiError.messageOf(err, 'Could not load this delivery.')))
      .finally(() => mounted.current && setLoading(false));
  }, [fetchDelivery]);

  useEffect(initialLoad, [initialLoad]);

  // Poll while the request still changes by itself; only while this screen is focused.
  const status = delivery?.status;
  useFocusEffect(
    useCallback(() => {
      if (!status || !isUnfinished(status)) return undefined;
      const timer = setInterval(() => {
        fetchDelivery().catch(() => {});
      }, POLL_MS);
      return () => clearInterval(timer);
    }, [status, fetchDelivery]),
  );

  // Countdown tick while the offer window is open.
  const expiresAt = delivery?.expiresAt;
  const pending = status ? PENDING_STATUSES.includes(status) : false;
  useEffect(() => {
    if (!pending || !expiresAt) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [pending, expiresAt]);

  // Prefill the repost fare once; clearing the box must not refill it.
  const repostPrefilled = useRef(false);
  useEffect(() => {
    if (repostPrefilled.current || delivery?.proposedFare == null) return;
    repostPrefilled.current = true;
    setRepostFare(String(delivery.proposedFare));
  }, [delivery?.proposedFare]);

  const offers = useMemo(() => sortOffers(delivery?.offers ?? [], sort), [delivery?.offers, sort]);

  const run = async (key: string, fn: () => Promise<Delivery | void>) => {
    if (busy) return;
    setBusy(key);
    setActionError(null);
    try {
      const d = await fn();
      if (d && mounted.current) setDelivery(d);
    } catch (err) {
      if (mounted.current) setActionError(ApiError.messageOf(err, 'Something went wrong. Please try again.'));
    } finally {
      if (mounted.current) setBusy(null);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDelivery()
      .catch(() => {})
      .finally(() => setRefreshing(false));
  };

  const pay = () =>
    run('pay', async () => {
      const result = await deliveryApi.pay(deliveryId);
      if (result.testMode) {
        setTestPaid(true);
        return result.delivery;
      }
      if (result.status === 'succeeded' || !result.clientSecret) return result.delivery;
      // Stripe mode: confirm the PaymentIntent in Stripe's own sheet, then refetch —
      // the webhook assigns the rider.
      const init = await initPaymentSheet({
        merchantDisplayName: 'DoHuub',
        paymentIntentClientSecret: result.clientSecret,
        returnURL: ENV.stripeReturnUrl,
      });
      if (init.error) throw new Error(init.error.message);
      const presented = await presentPaymentSheet();
      if (presented.error) {
        if (presented.error.code === 'Canceled') return result.delivery;
        throw new Error(presented.error.message);
      }
      return fetchDelivery();
    });

  const confirmCancel = async () => {
    setModalError(null);
    setBusy('cancel');
    try {
      const d = await deliveryApi.cancel(deliveryId);
      setDelivery(d);
      setCancelVisible(false);
    } catch (err) {
      setModalError(ApiError.messageOf(err, 'Could not cancel.'));
      fetchDelivery().catch(() => {});
    } finally {
      setBusy(null);
    }
  };

  const submitProblem = async () => {
    setModalError(null);
    setBusy('dispute');
    try {
      const d = await deliveryApi.dispute(deliveryId, {
        reason: problemReason,
        details: problemDetails.trim() || undefined,
      });
      setDelivery(d);
      setProblemVisible(false);
    } catch (err) {
      setModalError(ApiError.messageOf(err, 'Could not send your report.'));
    } finally {
      setBusy(null);
    }
  };

  const header = (
    <SubScreenHeader
      title={delivery ? delivery.reference : 'Delivery'}
      subtitle={delivery ? (delivery.type === 'order' ? `Order ${delivery.orderRef ?? ''}` : 'Package delivery') : undefined}
      onBack={() => navigation.goBack()}
    />
  );

  if (loading && !delivery) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        {header}
        <LoadingState />
      </MainScreenLayout>
    );
  }
  if (!delivery) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        {header}
        <ErrorState message={loadError || 'Delivery not found'} onRetry={initialLoad} />
      </MainScreenLayout>
    );
  }

  const d = delivery;
  const isLive = LIVE_STATUSES.includes(d.status);
  const leftMs = d.expiresAt ? new Date(d.expiresAt).getTime() - now : 0;
  const windowOpen = d.acceptingResponses && leftMs > 0;
  const fare = d.agreedFare ?? d.proposedFare;
  const selectedOffer = d.offers.find(o => o.id === d.selectedOfferId) ?? null;
  const canCancel = PENDING_STATUSES.includes(d.status);
  const canReport = isLive || d.status === 'delivered';
  const showMap = isLive || d.status === 'delivered' || d.status === 'disputed';
  const isTestPayment = testPaid || d.payment.mode === 'test';

  const call = (phone?: string | null) => {
    if (phone) Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      {header}
      <ScrollView
        testID="delivery-detail-scroll"
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.cardTitleRow, { marginBottom: 12 }]}>
          <StatusPill status={d.status} />
          {fare != null ? (
            <Price amount={fare} currency={d.currency} style={[styles.offerPrice, { color: colors.text }]} align="right" />
          ) : null}
        </View>

        {d.status === 'disputed' ? (
          <Banner
            testID="delivery-disputed-banner"
            tone="danger"
            icon="alert-circle"
            title={d.dispute?.resolvedAt ? 'Problem resolved' : 'Problem reported — DoHuub support is reviewing'}
            text={[d.dispute?.reason, d.dispute?.details].filter(Boolean).join(' · ') || undefined}
          />
        ) : null}

        {isTestPayment && (isLive || d.status === 'delivered') ? (
          <View style={styles.testBadge} testID="delivery-test-payment">
            <Icon name="flask-outline" size={18} color={colors.amberText} />
            <Text style={styles.testBadgeText}>Test payment — no real money moves.</Text>
          </View>
        ) : null}

        {actionError ? <ErrorBanner message={actionError} /> : null}

        {/* ------------------------------------------- waiting for riders */}
        {d.status === 'open' ? (
          <View style={styles.card} testID="delivery-waiting">
            <View style={styles.waitingHero}>
              <View style={styles.pulseOuter}>
                <View style={styles.pulseInner}>
                  <Icon name="bicycle" size={26} color={colors.white} />
                </View>
              </View>
              <Text style={styles.cardTitle}>Finding nearby riders…</Text>
              <Text style={[styles.muted, { textAlign: 'center' }]}>
                Riders near the pickup can accept your fare or counter once. You will choose who delivers.
              </Text>
              {windowOpen ? (
                <>
                  <Text style={styles.countdown} testID="delivery-countdown">
                    {formatCountdown(leftMs)}
                  </Text>
                  <Text style={styles.muted}>left for riders to respond</Text>
                </>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* ------------------------------------------------- offers list */}
        {d.status === 'offers' ? (
          <>
            <View style={[styles.cardTitleRow, { marginBottom: 6 }]}>
              <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
                {offers.length} {offers.length === 1 ? 'rider' : 'riders'} responded
              </Text>
              {windowOpen ? <Text style={styles.muted}>{formatCountdown(leftMs)} left</Text> : null}
            </View>
            {!windowOpen ? (
              <Text style={[styles.hint, { marginTop: 0, marginBottom: 8 }]}>
                The response window has closed — you can still choose one of these riders.
              </Text>
            ) : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
              {SORTS.map(s => (
                <TouchableOpacity
                  key={s.key}
                  testID={`offer-sort-${s.key}`}
                  style={[styles.chip, sort === s.key && styles.chipActive]}
                  onPress={() => setSort(s.key)}
                >
                  <Text style={[styles.chipText, sort === s.key && styles.chipTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {offers.map((o, i) => (
              <OfferCard
                key={o.id}
                index={i}
                offer={o}
                currency={d.currency}
                proposedFare={d.proposedFare}
                selected={false}
                busy={busy != null}
                onSelect={() => run(`select-${o.id}`, () => deliveryApi.select(d.id, o.id))}
              />
            ))}
          </>
        ) : null}

        {/* ---------------------------------------------------- pay step */}
        {d.status === 'selected' ? (
          <View testID="delivery-pay-step">
            <Text style={styles.cardTitle}>Confirm and pay</Text>
            {selectedOffer ? (
              <OfferCard
                index={0}
                offer={selectedOffer}
                currency={d.currency}
                proposedFare={d.proposedFare}
                selected
              />
            ) : null}
            <View style={styles.card}>
              <View style={[styles.cardTitleRow, { marginBottom: 4 }]}>
                <Text style={styles.bodyText}>Delivery fare</Text>
                <Price amount={d.agreedFare} currency={d.currency} style={[styles.bodyText, styles.strong]} align="right" />
              </View>
              <Text style={styles.hint}>
                Paid up front by card — the rider is assigned as soon as the payment clears. No cash.
              </Text>
            </View>
            <PrimaryButton
              testID="delivery-pay"
              label="Pay and assign rider"
              onPress={pay}
              loading={busy === 'pay'}
              disabled={busy != null && busy !== 'pay'}
            />
            <TouchableOpacity
              testID="delivery-change-rider"
              style={styles.outlineBtn}
              disabled={busy != null}
              onPress={() => run('unselect', () => deliveryApi.unselect(d.id))}
            >
              <Text style={styles.outlineBtnText}>Choose a different rider</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ------------------------------------------- live tracking */}
        {showMap ? <DeliveryMap delivery={d} /> : null}

        {d.rider && (isLive || d.status === 'delivered' || d.status === 'disputed') ? (
          <View style={styles.card} testID="delivery-rider-card">
            <View style={styles.offerHead}>
              <RiderAvatar rider={d.rider} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.offerName}>{d.rider.fullName}</Text>
                <RiderStats rider={d.rider} />
                {d.rider.vehiclePlate ? <Text style={styles.offerMetaText}>Plate {d.rider.vehiclePlate}</Text> : null}
              </View>
              {d.rider.phone && isLive ? (
                <TouchableOpacity
                  testID="delivery-call-rider"
                  style={styles.callBtn}
                  onPress={() => call(d.rider?.phone)}
                  accessibilityLabel="Call rider"
                >
                  <Icon name="call" size={20} color={colors.white} />
                </TouchableOpacity>
              ) : null}
            </View>
            {isLive && d.etaMinutes != null ? (
              <View style={[styles.guide, { marginTop: 12 }]}>
                <Icon name="time-outline" size={18} color={colors.primaryDark} />
                <Text style={styles.guideText}>
                  {d.status === 'assigned' ? 'Heading to pickup' : 'Arriving at drop-off'} · about {d.etaMinutes} min
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {isLive || d.status === 'delivered' || d.status === 'disputed' ? <Timeline delivery={d} /> : null}

        {/* ------------------------------------------------- delivered */}
        {d.status === 'delivered' ? (
          d.rating ? (
            <View style={styles.card} testID="delivery-rated">
              <Text style={styles.cardTitle}>Your rating</Text>
              <Stars value={d.rating.stars} size={26} />
              {d.rating.comment ? <Text style={[styles.muted, { textAlign: 'center' }]}>“{d.rating.comment}”</Text> : null}
            </View>
          ) : (
            <View style={styles.card} testID="delivery-rate">
              <Text style={[styles.cardTitle, { textAlign: 'center' }]}>How was your delivery?</Text>
              {d.proof?.recipientName ? (
                <Text style={[styles.muted, { textAlign: 'center' }]}>Received by {d.proof.recipientName}</Text>
              ) : null}
              <Stars value={stars} onChange={setStars} />
              <TextInput
                testID="delivery-rate-comment"
                style={[styles.input, styles.inputMultiline]}
                value={comment}
                onChangeText={setComment}
                placeholder="Say something about your rider (optional)"
                placeholderTextColor={colors.textFaint}
                multiline
              />
              <PrimaryButton
                testID="delivery-rate-submit"
                label="Rate rider"
                style={{ marginTop: 12 }}
                disabled={stars === 0}
                loading={busy === 'rate'}
                onPress={() => run('rate', () => deliveryApi.rate(d.id, { stars, comment: comment.trim() || undefined }))}
              />
            </View>
          )
        ) : null}

        {/* -------------------------------------------- expired / cancelled */}
        {d.status === 'expired' || (d.status === 'cancelled' && d.payment.status !== 'paid') ? (
          <View style={styles.card} testID="delivery-repost">
            <Text style={styles.cardTitle}>
              {d.status === 'expired' ? 'No rider took this request' : 'Request cancelled'}
            </Text>
            <Text style={styles.muted}>
              {d.status === 'expired'
                ? 'Nobody responded in time. Post it again — a higher fare usually gets faster responses.'
                : 'You can post this request again whenever you are ready.'}
            </Text>
            <Text style={[styles.label, { marginTop: 12 }]}>Fare ({d.currency})</Text>
            <TextInput
              testID="delivery-repost-fare"
              style={styles.input}
              selectTextOnFocus
              value={repostFare}
              onChangeText={t => setRepostFare(t.replace(/[^0-9.]/g, ''))}
              keyboardType="decimal-pad"
            />
            <PrimaryButton
              testID="delivery-repost-submit"
              label="Repost request"
              style={{ marginTop: 12 }}
              loading={busy === 'repost'}
              onPress={() => {
                const v = Number(repostFare);
                run('repost', () =>
                  deliveryApi.repost(d.id, Number.isFinite(v) && v >= 1 && v !== d.proposedFare ? v : undefined),
                );
              }}
            />
          </View>
        ) : null}

        <RouteCard delivery={d} />

        {d.payment.paidAt ? (
          <Text style={[styles.hint, { textAlign: 'center' }]}>
            Paid {formatDateTime(d.payment.paidAt)}
          </Text>
        ) : null}

        {canCancel ? (
          <TouchableOpacity
            testID="delivery-cancel"
            style={styles.dangerLink}
            onPress={() => {
              setModalError(null);
              setCancelVisible(true);
            }}
          >
            <Text style={styles.dangerLinkText}>Cancel request</Text>
          </TouchableOpacity>
        ) : null}

        {canReport ? (
          <TouchableOpacity
            testID="delivery-report-problem"
            style={styles.dangerLink}
            onPress={() => {
              setModalError(null);
              setProblemVisible(true);
            }}
          >
            <Text style={styles.dangerLinkText}>Report a problem</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      <ConfirmModal
        visible={cancelVisible}
        title="Cancel request"
        message="Riders will be told the request is cancelled. You have not been charged."
        icon="close-circle-outline"
        iconTone="danger"
        confirmLabel="Cancel request"
        cancelLabel="Keep it"
        onConfirm={confirmCancel}
        onCancel={() => setCancelVisible(false)}
        loading={busy === 'cancel'}
        error={modalError}
        confirmTestID="delivery-cancel-confirm"
      />

      <Modal visible={problemVisible} transparent animationType="slide" onRequestClose={() => setProblemVisible(false)}>
        <View style={styles.sheetOverlay}>
          {/* Backdrop is a sibling, not a wrapper, so the sheet's controls stay individually accessible. */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => busy !== 'dispute' && setProblemVisible(false)}
            accessibilityLabel="Close"
          />
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.sheet}>
              <Text style={styles.cardTitle}>Report a problem</Text>
              <Text style={[styles.muted, styles.sheetIntro]}>
                DoHuub support reviews every report. The rider's payment is held until it is resolved.
              </Text>
              <View style={[styles.chipWrap, styles.sheetIntro]}>
                {PROBLEM_REASONS.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.chip, problemReason === r && styles.chipActive]}
                    onPress={() => setProblemReason(r)}
                  >
                    <Text style={[styles.chipText, problemReason === r && styles.chipTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                testID="delivery-problem-details"
                style={[styles.input, styles.inputMultiline]}
                value={problemDetails}
                onChangeText={setProblemDetails}
                placeholder="Tell us what happened (optional)"
                placeholderTextColor={colors.textFaint}
                multiline
              />
              {modalError ? <ErrorBanner message={modalError} /> : null}
              <PrimaryButton
                testID="delivery-problem-submit"
                label="Send report"
                style={styles.sheetButton}
                loading={busy === 'dispute'}
                onPress={submitProblem}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </MainScreenLayout>
  );
}
