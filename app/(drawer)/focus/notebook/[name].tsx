import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { LoadingContainer } from '~/components/LoadingFull';
import { PulsingCircle } from '~/components/animated/pulsing-circle';
import { CategoryBadge } from '~/components/badges';
import { Card } from '~/components/card';
import { CATEGORIES } from '~/components/focus/focus-category';
import { FocusListItem } from '~/components/focus/focus-list-item';
import { FocusItemIcon } from '~/components/focus/focus-type-icon';
import { Text } from '~/theme';
import { useFocusQuery } from '~/utils/services/Focus.query.generated';
import { useDeleteFocusItemMutation } from '~/utils/services/notes/DeleteFocusItem.mutation.generated';

export default function Notebook() {
  const { name } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [getFocusResponse, getFocus] = useFocusQuery({
    pause: false,
    requestPolicy: 'network-only',
    variables: { filter: { category: name } },
  });
  const [deleteResponse, deleteFocusItem] = useDeleteFocusItemMutation();
  const isLoaded = !getFocusResponse.fetching;
  const notebookItems = getFocusResponse.data?.focus.items || [];
  const hasNotebookItems = isLoaded && notebookItems.length > 0;

  const onItemDelete = useCallback((id: string) => {
    setIsDeleting(true);
    deleteFocusItem({ input: { id } });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getFocus();
  }, [getFocus]);

  const renderItem = useCallback(
    ({ item, index }: any) => {
      return (
        <FocusListItem
          icon={<FocusItemIcon item={item} />}
          label={item.text}
          onDelete={() => onItemDelete(item.id)}
          showBorder={index < notebookItems.length - 1}
          headerRight={<CategoryBadge category={item.category} />}
        />
      );
    },
    [notebookItems, onItemDelete]
  );

  useEffect(() => {
    if (refreshing && isLoaded) {
      setRefreshing(false);
    }

    if (isDeleting && deleteResponse.data?.deleteFocusItem.success) {
      setIsDeleting(false);
      getFocus();
    }
  }, [deleteResponse, isLoaded, refreshing]);

  const categoryName = typeof name === 'string' ? CATEGORIES[name]?.label : name;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
        <Text variant="header">{categoryName}</Text>
      </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={{ flex: 1, paddingHorizontal: 8 }}>
        {getFocusResponse.fetching ? (
          <LoadingContainer>
            <PulsingCircle />
          </LoadingContainer>
        ) : null}
        {!getFocusResponse.fetching && notebookItems.length > 0 ? (
          <Card>
            <FlatList
              scrollEnabled={false}
              data={notebookItems}
              keyExtractor={(item) => `${item.id}`}
              renderItem={renderItem}
            />
          </Card>
        ) : null}
        {hasNotebookItems ? (
          <Text variant="body" style={{ textAlign: 'center', padding: 16 }}>
            No items in this notebook
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
