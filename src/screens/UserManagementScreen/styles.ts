import styled from 'styled-components/native';
import { ListItem } from 'react-native-elements';
import theme from '../../styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

export const UserCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

export const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

export const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

export const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: {role: string}) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

export const RoleText = styled.Text<{ role: string }>`
  color: ${(props: {role: string}) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary;
      case 'doctor':
        return theme.colors.success;
      default:
        return theme.colors.secondary;
    }
  }};
  font-size: 12px;
  font-weight: 500;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;


