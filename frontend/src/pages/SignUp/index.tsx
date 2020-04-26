import React, { useCallback } from 'react';
import { FiLogIn, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Container, Content, Background } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => {
  const handleFormSubmision = useCallback(async (data) => {
    const validator = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório.'),
      email: Yup.string()
        .required('Email obrigatório.')
        .email('Digite um email válido.'),
      password: Yup.string().min(6, 'Mínimo de 6 caracteres.'),
    });

    try {
      await validator.validate(data, { abortEarly: false });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form onSubmit={handleFormSubmision}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            type="password"
            icon={FiLock}
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="create">
          <FiLogIn />
          Voltar para logon
        </a>
      </Content>

      <Background />
    </Container>
  );
};

export default SignUp;
