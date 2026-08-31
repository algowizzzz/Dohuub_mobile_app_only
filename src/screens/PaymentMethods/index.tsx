import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import ScreenStatusBar from '../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { usePaymentCardStore } from '../../store/paymentCardStore';
import EmptyCardsState from './components/EmptyCardsState';
import PaymentCardRow from './components/PaymentCardRow';
import AddCardModal from './components/AddCardModal';
import type { ApiCard } from '../../services/accountApi';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

export default function PaymentMethodsScreen({ navigation }: Props) {
  const cards = usePaymentCardStore(state => state.cards);
  const loading = usePaymentCardStore(state => state.loading);
  const error = usePaymentCardStore(state => state.error);
  const load = usePaymentCardStore(state => state.load);
  const addCard = usePaymentCardStore(state => state.addCard);
  const setDefault = usePaymentCardStore(state => state.setDefault);
  const removeCard = usePaymentCardStore(state => state.removeCard);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [cardPendingDelete, setCardPendingDelete] = useState<ApiCard | null>(null);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  const handleDeleteConfirmed = async () => {
    if (!cardPendingDelete) return;
    setDeleting(true);
    try {
      await removeCard(cardPendingDelete.id);
      setCardPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SubScreenHeader title="Payment Methods" onBack={() => navigation.goBack()} />

      {loading && cards.length === 0 ? (
        <LoadingState />
      ) : error && cards.length === 0 ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <View style={styles.body}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {cards.length === 0 ? (
              <EmptyCardsState />
            ) : (
              cards.map(card => (
                <PaymentCardRow
                  key={card.id}
                  card={card}
                  onEdit={() => navigation.navigate('EditPaymentCard', { cardId: card.id })}
                  onSetDefault={() => setDefault(card.id)}
                  onDelete={() => setCardPendingDelete(card)}
                />
              ))
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddModalVisible(true)}
              activeOpacity={0.8}
            >
              <Icon name="add" size={22} color={colors.primary} />
              <Text style={styles.addButtonLabel}>Add New Card</Text>
            </TouchableOpacity>

            <View style={styles.secureBadge}>
              <Icon name="lock-closed" size={16} color={colors.primary} />
              <Text style={styles.secureBadgeLabel}>Secured by Stripe</Text>
            </View>
          </ScrollView>
        </View>
      )}

      <AddCardModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSave={async result => {
          await addCard({
            paymentMethodId: result.paymentMethodId,
            cardHolderName: result.cardHolderName,
            isDefault: result.setAsDefault,
          });
          setAddModalVisible(false);
        }}
      />

      <ConfirmModal
        visible={!!cardPendingDelete}
        title="Delete card"
        message={`Remove the card ending in ${cardPendingDelete?.last4 ?? ''}? This can't be undone.`}
        icon="trash-outline"
        iconTone="danger"
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setCardPendingDelete(null)}
      />
    </SafeAreaView>
  );
}