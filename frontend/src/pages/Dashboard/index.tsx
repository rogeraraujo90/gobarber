import React from 'react';
import { FiPower } from 'react-icons/fi';
import { Container, HeaderContent, Profile } from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { loggedUser, signOut } = useAuth();

  return (
    <Container>
      <HeaderContent>
        <img src={logoImg} alt="GoBarber" />
        <Profile>
          <img src={loggedUser.avatar_url} alt={loggedUser.name} />
          <div>
            <span>Bem-vindo</span>
            <strong>{loggedUser.name}</strong>
          </div>
        </Profile>
        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
    </Container>
  );
};

export default Dashboard;
