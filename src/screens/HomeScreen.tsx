import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addItem,
  markPurchased,
  editItem,
  deleteItem,
} from '../redux/shoppingListSlice';
import {RootState, AppDispatch} from '../redux/store';
import {Colors} from '../contant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

const HomeScreen = () => {
  const [name, setName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.shoppingList?.list);

  const animationDuration = 500;
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const onDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      dispatch(deleteItem(id));
    }, animationDuration);
  };

  const onAddItem = () => {
    if (editingItem) {
      dispatch(
        editItem({id: editingItem, name, quantity: parseFloat(quantity), unit}),
      );
      setEditingItem(null);
    } else {
      dispatch(addItem({name, quantity: parseFloat(quantity), unit}));
    }
    setName('');
    setQuantity('');
    setUnit('');
    setIsOpen(false);
  };

  const onEdit = (item: ShoppingItem) => {
    setName(item.name);
    setQuantity(item.quantity.toString());
    setUnit(item.unit);
    setEditingItem(item.id);
    setIsOpen(true);
  };

  const onCancel = () => {
    setIsOpen(false);
    setName('');
    setQuantity('');
    setUnit('');
    setEditingItem(null);
  };

  const renderItem = ({item, index}: {item: ShoppingItem; index: number}) => {
    return (
      <Animatable.View
        animation={deletingId === item.id ? 'fadeOutLeft' : undefined}
        duration={animationDuration}
        onAnimationEnd={() => deletingId === item.id && setDeletingId(null)}
        style={[
          styles.itemContainer,
          {borderColor: item.purchased ? 'green' : '#000'},
        ]}>
        <TouchableOpacity
          testID={`mark-purchased-${index}`}
          onPress={() => dispatch(markPurchased(item.id))}>
          <View style={[item.purchased ? styles.CheckBox : styles.Checked]}>
            <AntDesign name="check" color={Colors.white} size={16} />
          </View>
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text
            style={[styles.item, item.purchased && styles.purchased]}
            numberOfLines={1}>
            Name: {item.name}
          </Text>
          <Text style={[styles.item, item.purchased && styles.purchased]}>
            Qty : {item.quantity}
          </Text>
          <Text style={[styles.item, item.purchased && styles.purchased]}>
            Unit: {item.unit}
          </Text>
        </View>

        <View style={[styles.btnContainer]}>
          <TouchableOpacity
            disabled={item.purchased && true}
            testID={`edit-item-${index}`}
            style={[
              styles.miniBtn,
              {backgroundColor: item.purchased ? 'grey' : Colors.bg},
            ]}
            onPress={() => onEdit(item)}>
            <AntDesign name="edit" color={Colors.white} size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            testID={`delete-item-${index}`}
            disabled={item.purchased && true}
            style={[
              styles.miniBtn,
              {backgroundColor: item.purchased ? 'grey' : Colors.bg},
            ]}
            onPress={() => onDelete(item.id)}>
            <AntDesign name="delete" color={Colors.white} size={16} />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>ShoppingListByKP</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingBottom: 80}}
      />

      <TouchableOpacity
        testID="add-item-btn"
        style={styles.floatBtn}
        onPress={() => setIsOpen(true)}>
        <AntDesign name="plus" color={Colors.white} size={24} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </Text>

            <TextInput
              placeholder="Item name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Unit (e.g., kg, liters)"
              value={unit}
              onChangeText={setUnit}
              style={styles.input}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.button} onPress={onAddItem}>
                <Text style={styles.buttonText}>
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => onCancel()}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  itemContainer: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 'auto',
    width: '90%',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    padding: 12,
    alignSelf: 'center',
  },
  item: {
    fontSize: 18,
  },
  purchased: {
    textDecorationLine: 'line-through',
    color: Colors.green,
  },
  floatBtn: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.bg,
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  floatBtnText: {
    color: Colors.white,
    fontSize: 30,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.bg,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: Colors.grey,
  },
  miniBtn: {
    backgroundColor: Colors.bg,
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '15%',
  },
  header: {
    height: 80,
    backgroundColor: Colors.bg,
    padding: 12,
    marginBottom: 26,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    color: Colors.white,
    fontWeight: 'bold',
  },
  Checked: {
    height: 25,
    width: 25,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CheckBox: {
    height: 25,
    width: 25,
    backgroundColor: Colors.green,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    width: '60%',
  },
});

export default HomeScreen;
