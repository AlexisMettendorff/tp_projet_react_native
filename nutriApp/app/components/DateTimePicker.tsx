import { useState } from "react";
import { View, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type CustomDateTimePicker = {
  value: Date | null;
  onChange: (date: Date) => void;
  errorMessage: string;
};

export default function CustomDateTimePicker({
  value,
  onChange,
  errorMessage,
}: CustomDateTimePicker) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    onChange(date);
    hideDatePicker();
  };

  return (
    <View>
      <Text
        onPress={showDatePicker}
        style={{
          borderWidth: 1,
          borderColor: "gainsboro",
          padding: 10,
          borderRadius: 5,

          marginTop: 4,
          marginBottom: 2,
          color: "black",
        }}
      >
        {value ? new Date(value).toLocaleDateString() : "Select a date"}
      </Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Text style={{ color: "crimson" }} numberOfLines={1}>
        {errorMessage}
      </Text>
    </View>
  );
}
