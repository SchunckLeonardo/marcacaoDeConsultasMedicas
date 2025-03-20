import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button } from 'react-native-elements';
import { HeaderContainer, HeaderTitle } from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';

type RootStackParamList = {
    Home: undefined;
    CreateAppointment: undefined;
    Profile: undefined;
};

type CreateAppointmentScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

const CreateAppointmentScreen: React.FC<CreateAppointmentScreenProps> = ({ navigation }) => {
    const [date, setDate] = useState(new Date())

    return (
        <Container>
            <HeaderContainer>
                <HeaderTitle>Agendar Consulta</HeaderTitle>
            </HeaderContainer>

            <Content>
                <Button
                    title="Voltar"
                    icon={{
                        name: 'arrow-left',
                        type: 'font-awesome',
                        size: 20,
                        color: 'white'
                    }}
                    buttonStyle={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 20
                    }}
                    onPress={() => navigation.goBack()}
                />

                {/* Aqui você pode adicionar os campos do formulário de agendamento */}
                <FormText>Formulário de Agendamento</FormText>
                <FormContent>
                    <FormField>
                        <FormLabelField>
                            Selecione a data e o horário do seu agendamento
                        </FormLabelField>
                        <DateTimePicker
                            mode='datetime'
                            value={new Date()}
                            onChange={(e) => setDate(new Date(e.nativeEvent.timestamp))}
                        />
                    </FormField>
                </FormContent>
            </Content>
        </Container>
    );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

const FormText = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  color: ${theme.colors.text};
  text-align: center;
`;

const FormContent = styled.View`
    border: 1px solid ${theme.colors.primary};
    border-radius: 20px;
    padding: 20px;
    margin-top: 20px;
`

const FormField = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 20px;
`

const FormLabelField = styled.Text`
    color: #1818189c;
`

export default CreateAppointmentScreen;