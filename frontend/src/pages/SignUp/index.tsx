import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { Container, Content, Background, AnimatedForm } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleFormSubmision = useCallback(
    async (data) => {
      formRef.current?.setErrors({});

      const validator = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório.'),
        email: Yup.string()
          .required('Email obrigatório.')
          .email('Digite um email válido.'),
        password: Yup.string().min(6, 'Mínimo de 6 caracteres.'),
      });

      try {
        await validator.validate(data, { abortEarly: false });

        await api.post('/users', data);

        addToast({
          title: 'Conta criada com sucesso',
          description: 'Sua foi criada. Faça logon para usar o GoBarber',
          type: 'success',
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
        } else {
          addToast({
            title: 'Erro ao criar conta',
            description: 'Ocorreu um erro ao criar sua conta. Tente novamente.',
            type: 'error',
          });
        }
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimatedForm>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleFormSubmision}>
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

          <Link to="/">
            <FiLogIn />
            Voltar para logon
          </Link>
        </AnimatedForm>
      </Content>
    </Container>
  );
};

export default SignUp;
