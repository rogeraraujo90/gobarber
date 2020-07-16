import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimatedForm } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const handleFormSubmision = useCallback(
    async (data: ResetPasswordFormData) => {
      formRef.current?.setErrors({});

      const validator = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        passwordConfirmation: Yup.string().oneOf(
          [Yup.ref('password')],
          'Senhas não são iguais'
        ),
      });

      try {
        await validator.validate(data, { abortEarly: false });
        const token = queryParams.get('token');

        if (!token) {
          throw new Error();
        }

        const { password, passwordConfirmation } = data;

        await api.post('/passwords/reset', {
          password,
          passwordConfirmation,
          token,
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
        } else {
          addToast({
            title: 'Erro no resetar senha',
            description:
              'Ocorreu um erro ao resetar sua senha. Tente novamente.',
            type: 'error',
          });
        }
      }
    },
    [queryParams, history, addToast]
  );

  return (
    <Container>
      <Content>
        <AnimatedForm>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleFormSubmision}>
            <h1>Redefinir sua senha</h1>

            <Input
              name="password"
              type="password"
              icon={FiLock}
              placeholder="Nova senha"
            />

            <Input
              name="passwordConfirmation"
              type="password"
              icon={FiLock}
              placeholder="Repita a senha"
            />

            <Button type="submit">Redefinir</Button>
          </Form>
        </AnimatedForm>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
