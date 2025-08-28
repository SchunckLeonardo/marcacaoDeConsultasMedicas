import { FontAwesome } from "@expo/vector-icons"
import { Button } from "react-native-elements"
import theme from "../../../styles/theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { GestureResponderEvent } from "react-native";

type CreateAppointmentButtonProps = {
    onPress: ((event: GestureResponderEvent) => void) | undefined
};

export const CreateAppointmentButton = ({
    onPress
}: CreateAppointmentButtonProps) => {
    return (
        <Button
          title="Agendar Nova Consulta"
          icon={
            <FontAwesome
              name="calendar-plus-o"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: theme.spacing.medium
          }}
          onPress={onPress}
        />
    )
}